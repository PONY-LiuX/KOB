import {Cell} from "./Cell";
import {AcGameObjects} from "./AcGameObjects";

export class Snake extends AcGameObjects {
    constructor(info, gamemap) {
        super();

        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;

        this.cells = [new Cell(info.r, info.c)];//存放蛇的身体，蛇头为cell[0]
        this.next_cell = null;//下一步的目标位置

        this.speed = 5;//蛇每秒钟走5个格子
        this.direction = -1; //-1表示没有指令 0、1、2、3表示上右下左
        this.status = "idle" //idle表示静止，move表示正在移动，die表示死亡

        this.dr = [-1, 0, 1, 0];//四个方向行的偏移量
        this.dc = [0, 1, 0, -1];//四个方向列的偏移量

        this.step = 0; //表示步数
        this.eps = 1e-2;//允许的误差，当两个点的坐标相差这么多，认为重合

        this.eye_direction = 0; //蛇头方向 先向上
        if (this.id === 1) this.eye_direction = 2;//左下角的蛇初始朝上

        this.eye_dx = [//蛇眼x的偏移量
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, -1],
        ];
        this.eye_dy = [//蛇眼y的偏移量
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
        ];
    }

    start() {

    }

    set_direction(d) {  //统一方向 
        this.direction = d;
    }

    check_tail_increasing() { //检测当前步数，蛇的长度是否增加
        if (this.step <= 10) return true;
        if (this.step % 3 === 1) return true;
        return false;
    }

    next_step() {//将蛇的状态变为走下一步
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.eye_direction = d;
        this.direction = -1; //清空操作
        this.status = "move";
        this.step++; //步数加1

        const k = this.cells.length; //所有的球数
        for (let i = k; i > 0; i--) {  //球向后引用
            //深拷贝
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));//转成JSON深层复制
        }

        // 检查 如果nextcell要撞了 就改变状态
        // 牢记这个游戏的时间有两个粒度 宏观（要去哪）和微观（每一帧的更新过程）

        // if (!this.gamemap.check_valid(this.next_cell)) this.state = 'die'
    }
    // 移动
    update_move() {
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.eps) {//走到目标点，距离小于误差
            this.cells[0] = this.next_cell; //目标点存下，作为新的头
            this.next_cell = null; //目标点清空
            this.status = "idle"; //移到目标点了，停下来

            if (!this.check_tail_increasing()) { //蛇不变长，砍掉蛇尾
                this.cells.pop();
            }
        } else {
            const move_distance = this.speed * this.timedelta / 1000;//每两帧之间走的距离 毫秒转秒
            this.cells[0].x += move_distance * dx / distance;
            this.cells[0].y += move_distance * dy / distance; //适用于斜线的情况

            if (!this.check_tail_increasing()) { //蛇尾不变长，走向下一个目的地
                const k = this.cells.length;
                const tail = this.cells[k - 1], tail_target = this.cells[k - 2];
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
                tail.x += move_distance * tail_dx / distance;
                tail.y += move_distance * tail_dy / distance;
            }
        }
    }

    update() {
        if (this.status === 'move') {
            this.update_move();
        }

        this.render();
    }

    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;
        if (this.status === "die") {
            ctx.fillStyle = "white";
        }
        for (const cell of this.cells) {
            ctx.beginPath();
            ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }

        for (let i = 1; i < this.cells.length; i++) { //画矩形
            const a = this.cells[i - 1], b = this.cells[i];
            //比如倒数第一个球和倒数第二个球太近，不要画了
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps) {
                continue;
            }
            if (Math.abs(a.x - b.x) < this.eps) {  // x几乎没变，竖直方向画
                ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
            } else {  // y几乎没变，水平方向画
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);
            }
        }

        ctx.fillStyle = "black"; //画眼睛
        for (let i = 0; i < 2; i++) {
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;

            ctx.beginPath();
            ctx.arc(eye_x, eye_y, L * 0.05, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}