const AC_GAME_OBJECTS = [];

export class AcGameObjects{
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.timedelta = 0; //帧的间隔
        this.has_called_start = false;//判断是否第一次执行

    }

    start() { //创建时只执行一次

    }
    update() { //除了第一帧之外，只执行一次

    }
    on_destroy() { //删除之前执行

    }

    destroy() { //删除
        this.on_destroy();

        for (let i in AC_GAME_OBJECTS) { //in遍历下标
            const obj = AC_GAME_OBJECTS[i];
            if(obj ==this){
                AC_GAME_OBJECTS.splice(i);
                break;
                }        
            }
        }
    }

let last_timestamp;//上一次执行的时刻

const step = timestamp => {
    for(let obj of AC_GAME_OBJECTS){//of遍历值
        if(!obj.has_called_start){
            obj.has_called_start = true;
            obj.start();
        }else{
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(step)
}

requestAnimationFrame(step)