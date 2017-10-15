// 管子类
function Pipe(pipe_down,pipe_up,speed,medalArr){
	// pipe有两个图片
	// 上面的管子 开口向下
	this.up =  pipe_down;
	// 下面的管子 开口向上
	this.down = pipe_up;
	// 管子是跟随地面移动的所以速度默认与地面一致
	this.speed = speed;
	// 管子之间的开口是150px
	this.distance = 150;
	// 管子帧编号
	this.iframe = 0;
	// 上面管子的长度 随即一个0-250之间的数字
	this.up_length = parseInt(Math.random() * 250);
	// 下面的管子的长度。 根据整体400高，开口150 和上面管子的长度计算出来的。
	this.down_length = 400 - 150 - this.up_length;
	// 金币数组
	this.medalArr  = medalArr;
	// 索引
	this.idx = parseInt(Math.random()*this.medalArr.length);
	// 每一次携带的金币是不同的
	this.medal = this.medalArr[this.idx];
	// 标识是否携带金币
	this.hasMedal = true;
}
// 管子的移动方法
Pipe.prototype.move = function(){
	// 每次都自加 
	this.iframe ++;
}