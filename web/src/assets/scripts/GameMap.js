import {AcGameObjects} from "./AcGameObjects";
import {Wall} from "./Wall";
import {Snake} from "./Snake";

export class GameMap extends AcGameObjects {
    constructor(ctx, parent) {
        super();

        this.ctx = ctx;
        this.parent = parent;
     

        //一个单位长度
        this.L = 0;

        //行数，列数
        this.rows = 13;
        this.cols = 14;

        this.walls = [];

        //创建两条蛇
        this.snakes = [
            new Snake({id: 0, color: '#4876EC', r: this.rows - 2, c: 1}, this),
            new Snake({id: 1, color: "#F94848", r: 1, c: this.cols - 2}, this),
        ]

    }

    create_walls() {
        const g = this.gamemap
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }
    }
    //监听事件 从前端 canvas中 通过加上tabindex="0"实现
    add_listening_events() {
        if (this.store.state.record.is_record) {
            let k = 0;
            const a_steps = this.store.state.record.a_steps;
            const b_steps = this.store.state.record.b_steps;
            const loser = this.store.state.record.record_loser;
            const [snake0, snake1] = this.snakes;
            const interval_id = setInterval(() => {
                if (k >= a_steps.length - 1) {
                    if (loser === "all" || loser === "A") {
                        snake0.status = "die";
                    }
                    if (loser === "all" || loser === "B") {
                        snake1.status = "die";
                    }
                    clearInterval(interval_id);
                } else {
                    snake0.set_direction(parseInt(a_steps[k]));
                    snake1.set_direction(parseInt(b_steps[k]));
                }
                k++;
            }, 300)
        } else {
            this.ctx.canvas.focus(); //  canvas聚焦

            this.ctx.canvas.addEventListener("keydown", e => { //调用canvas API绑定keydown事件
                let d = -1;
                if (e.key === 'w') {
                    d = 0;
                } else if (e.key === 'd') {
                    d = 1;
                } else if (e.key === 's') {
                    d = 2;
                } else if (e.key === 'a') {
                    d = 3;
                }

                // if (d >= 0) {
                //     this.store.state.pk.socket.send(JSON.stringify({
                //         event: "move",
                //         direction: d,
                //     }))
                // }
            });
        }
    }

    start() {
        this.create_walls();
        this.add_listening_events(); //监听
    }

    update_size() {
        //需要取整像素，去除图片缝隙
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    //判断两条蛇是否都执行了一步操作
    check_ready() {
        for (const snake of this.snakes) {
            if (snake.status !== "idle") return false;
            if (snake.direction === -1) return false;
        }
        return true;
    }

    next_step() {
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }

    check_valid(cell) {//检测目标位置是否合法：没有撞到蛇的身体和障碍物 (裁判)
        for (const wall of this.walls) {
            if (wall.r === cell.r && wall.c === cell.c) {
                return false;
            }
        }

        for (const snake of this.snakes) {
            //蛇尾要不要缩小，追自己的蛇尾的情况
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) {//蛇尾前进
                k--;
            }
            for (let i = 0; i < k; i++) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c) {
                    return false;
                }
            }
        }

        return true;
    }

    update() {
        this.update_size();
        if (this.check_ready()) { //判断两条蛇都准备好了
            this.next_step(); //两条蛇进入下一步
        }
        this.render();
    }

    render() {
        const color_even = "#aad751", color_odd = "#a2d149";
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if ((r + c) % 2 === 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);//先画cols再rows
            }
        }
    }
}