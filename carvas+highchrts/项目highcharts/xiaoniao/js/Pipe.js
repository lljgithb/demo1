// 管子类
function Pipe(pipe_down,pipe_up,speed){
	// pipe有两个图片
	// 上面的管子 开口向下
	this.up =  pipe_down;
	// 下面的管子 开口向上
	this.down = pipe_up;
	// 管子是跟随地面移动的所以速度默认与地面一致
	this.speed = speed;
	// 管子之间的开口是150px
	this.distance = 150;
	this.up_length = parseInt(Math.random() * 250);
	this.down_length = 400 - 150 - this.up_length;
}