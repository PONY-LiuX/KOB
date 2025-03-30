// 蛇的身体 canvas的坐标表示和之前的计算是相反的
export class Cell{
    constructor(r,c){
        this.r=r;
        this.c=c;
        this.x=c+0.5;
        this.y=r+0.5;
    }
}