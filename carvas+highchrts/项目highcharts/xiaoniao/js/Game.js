// 这一次与贪吃蛇不同。我们严格按照规范来做。重要的参数是传递进来的。
function Game(ctx,land,bg,pipe,bird){
	// 背景
	// 刷子 
	this.ctx = ctx;
	// 1 地面
	this.land = land;
	// 2 背景
	this.bg = bg;
	// 帧编号
	this.frameNum =0;
	// 管子属性
	this.pipe = pipe;
	// 鸟属性
	this.bird = bird;
	// 自动调用init方法
	this.init();
}
// 方法写在原型上
Game.prototype = {
	constructor:Game,
	init:function(){
		this.start();
		this.bindEvent();
	},
	renderBG :function(){
		this.ctx.drawImage(this.bg.pic,0-(this.frameNum*this.bg.speed)%this.bg.pic.width,0);
		this.ctx.drawImage(this.bg.pic,this.bg.pic.width-this.frameNum*this.bg.speed%this.bg.pic.width,0);
		this.ctx.drawImage(this.bg.pic,this.bg.pic.width*2-this.frameNum*this.bg.speed%this.bg.pic.width,0);
	},
	renderLand:function(){
		this.ctx.drawImage(this.land.pic,0-this.frameNum*this.land.speed%this.land.pic.width,400);
		this.ctx.drawImage(this.land.pic,this.land.pic.width-this.frameNum*this.land.speed%this.land.pic.width,400);
		// 如果只有两张那么会露馅所以加上第三张
		this.ctx.drawImage(this.land.pic,this.land.pic.width*2-this.frameNum*this.land.speed%this.land.pic.width,400);
	},
	start : function(){
		var me = this;
		this.timer = setInterval(function(){
			me.frameNum++;
			me.clear();
			me.renderBG();
			me.renderLand();
			me.renderPipe();
			me.renderBird();
			me.bird.go();
			if(!(me.frameNum%5)){
				me.bird.swing();
			}
		},20);
	},
	clear: function(){
		this.ctx.clearRect(0,0,500,600);
	},
	// 渲染管子
	renderPipe:function(){
		// 渲染上面的管子
		// 图像上的x值：0
		var up_img_x = 0;
		// 渲染上面管子的时候 使用的y值 是 上面管子的高度-上面管子的渲染高度
		var up_img_y = this.pipe.up.height - this.pipe.up_length;
		// 截取整个管子的宽度
		var up_img_w =  this.pipe.up.width;
		// 从xy确定的点开始截取一定的高度 这个距离就是随即出来的值pipe.up_length
		var up_img_h = this.pipe.up_length;
		// 绘制到canvas上的x点。 因为管子是从右向左一点点移动。所以就是canvas的宽度减去当前帧数*管子的速度的差
		var up_canvas_x = this.ctx.canvas.width-this.frameNum* this.pipe.speed;
		// 绘制到canvas上的y点。 因为贴顶 所以一直是0 
		var up_canvas_y = 0;
		// 绘制到canvas上的宽高 以原图像尺寸显示
		var up_canvas_w = up_img_w;
		var up_canvas_h = up_img_h;
		this.ctx.drawImage(this.pipe.up,up_img_x,up_img_y,up_img_w,up_img_h,up_canvas_x,up_canvas_y,up_canvas_w,up_canvas_h);
		// 渲染下面管子 
		// 截取点是从整个图片的左上角开始截取。所以是0,0
		var down_img_x = 0;
		var down_img_y = 0;
		// 截取的宽度是整个图片的宽度
		var down_img_w = up_img_w;
		// 截取的高度是 整个距离（400） 减去 上面管子的长度 再减去固定开口150 就是下面管子的高度
		var down_img_h = this.pipe.down_length;
		// 上下管子一直是对口。所以x值一致
		var down_canvas_x = up_canvas_x;
		// 下面管子在canvas上的y值。就是上面管子的高度加上150固定开口距离
		var down_canvas_y = up_img_h+this.pipe.distance;
		// 渲染的宽度是整个图片的宽度
		var down_canvas_w = up_canvas_w;
		// 渲染的高度是下面管子的高度 也就是下面管子的y值
		var down_canvas_h = down_img_h;
		this.ctx.drawImage(this.pipe.down,down_img_x,down_img_y,down_img_w,down_img_h,down_canvas_x,down_canvas_y,down_canvas_w,down_canvas_h);
	},
	// 渲染鸟
	renderBird:function(){
		// 鸟要旋转。第一步 先将鸟放到坐标系中心
		this.ctx.save();
		this.ctx.translate(125,(178+this.bird.y)<0?0:178+this.bird.y);
		if(this.bird.state ==="U"){
		   this.ctx.rotate(-this.bird.f*2/(180/Math.PI));
		}else {
			 this.ctx.rotate(this.bird.f/(180/Math.PI))
		}
    this.ctx.drawImage(this.bird.imgArr[this.bird.idx],-this.bird.width/2,-this.bird.height/2);
    this.ctx.restore();
	},
	// 绑定事件，让用户操作鸟的状态
	bindEvent:function(){
		var me = this;
		this.ctx.canvas.onclick = function(){
			// 调用鸟的方法
			me.bird.energy();
		}
	}
}