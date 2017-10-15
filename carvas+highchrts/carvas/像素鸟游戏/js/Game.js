// 这一次与贪吃蛇不同。我们严格按照规范来做。重要的参数是传递进来的。
function Game(ctx,land,bg,pipe,bird,title,tutorial){
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
	this.pipeArr = [pipe];
	// 鸟属性
	this.bird = bird;
	// title
	this.title = title;
	// tutorial
	this.tutorial = tutorial;
	// 决定管子出现的小的frameNum
	this.pipe_frame = 0;
	// 分数
	this.score = 0;
	// 自动调用init方法
	this.init();
}
// 方法写在原型上
Game.prototype = {
	constructor:Game,
	init:function(){
		// 初始化方法
		this.welcome(); 
	},
	// 渲染背景方法
	renderBG :function(){
		// 一张不够充满 两张的时候可以充满 但是移动的时候会露馅。所以必须要三张
		this.ctx.drawImage(this.bg.pic,0-(this.frameNum*this.bg.speed)%this.bg.pic.width,0);
		this.ctx.drawImage(this.bg.pic,this.bg.pic.width-this.frameNum*this.bg.speed%this.bg.pic.width,0);
		this.ctx.drawImage(this.bg.pic,this.bg.pic.width*2-this.frameNum*this.bg.speed%this.bg.pic.width,0);
	},
	renderLand:function(){
		// 同renderBG
		this.ctx.drawImage(this.land.pic,0-this.frameNum*this.land.speed%this.land.pic.width,400);
		this.ctx.drawImage(this.land.pic,this.land.pic.width-this.frameNum*this.land.speed%this.land.pic.width,400);
		this.ctx.drawImage(this.land.pic,this.land.pic.width*2-this.frameNum*this.land.speed%this.land.pic.width,400);
	},
	// 开始游戏
	start : function(){
		//备份this
		var me = this;
		// 设表先关
		clearInterval(this.timer);
		// 设表
		this.timer = setInterval(function(){
			// 主频率自加
			me.frameNum++;
			// 管子的频率 用于决定生成管子
			me.pipe_frame++;
			// 清空所有
			me.clear();
			// 渲染背景
			me.renderBG();
			// 渲染地面
			me.renderLand();
			// 渲染管子
			me.renderPipe();
			// 渲染鸟
			me.renderBird();
			// 让鸟下落
			me.bird.go(); 
			// 减少鸟的运动频率
			if(!(me.frameNum%5)){
				me.bird.swing();
			}
			// 创建管子 每隔150帧创建一次
			if(!(me.pipe_frame % 150)){
				me.createPipe();
			}
			me.rendScore();
		},20);
	},
	// 清空画布
	clear: function(){
		this.ctx.clearRect(0,0,500,600);
	},
	// 渲染管子
	renderPipe:function(){
		// 因为管子是一个数组 所以要循环渲染
		for(var i =0;i<this.pipeArr.length;i++){
			// 让管子移动
			this.pipeArr[i].move();
			// 如果当前的管子已经消失 那么就不要渲染 并且把它从数组中移除
			// 渲染上面的管子
			// 图像上的x值：0
			var up_img_x = 0;
			// 渲染上面管子的时候 使用的y值 是 上面管子的高度-上面管子的渲染高度
			var up_img_y = this.pipeArr[i].up.height - this.pipeArr[i].up_length;
			// 截取整个管子的宽度
			var up_img_w =  this.pipeArr[i].up.width;
			// 从xy确定的点开始截取一定的高度 这个距离就是随即出来的值pipeArr[i].up_length
			var up_img_h = this.pipeArr[i].up_length;
			// 绘制到canvas上的x点。 因为管子是从右向左一点点移动。所以就是canvas的宽度减去当前帧数*管子的速度的差
			var up_canvas_x = this.ctx.canvas.width- this.pipeArr[i].iframe * this.pipeArr[i].speed;
			if(up_canvas_x<-up_img_w){
				this.pipeArr.splice(i,1);
				i--;
				continue;
			}
			// 绘制到canvas上的y点。 因为贴顶 所以一直是0 
			var up_canvas_y = 0;
			// 绘制到canvas上的宽高 以原图像尺寸显示
			var up_canvas_w = up_img_w;
			var up_canvas_h = up_img_h;
			this.ctx.drawImage(this.pipeArr[i].up,up_img_x,up_img_y,up_img_w,up_img_h,up_canvas_x,up_canvas_y,up_canvas_w,up_canvas_h);
			// 渲染下面管子 
			// 截取点是从整个图片的左上角开始截取。所以是0,0
			var down_img_x = 0;
			var down_img_y = 0;
			// 截取的宽度是整个图片的宽度
			var down_img_w = up_img_w;
			// 截取的高度是 整个距离（400） 减去 上面管子的长度 再减去固定开口150 就是下面管子的高度
			var down_img_h = this.pipeArr[i].down_length;
			// 上下管子一直是对口。所以x值一致
			var down_canvas_x = up_canvas_x;
			// 下面管子在canvas上的y值。就是上面管子的高度加上150固定开口距离
			var down_canvas_y = up_img_h+this.pipeArr[i].distance;
			// 渲染的宽度是整个图片的宽度
			var down_canvas_w = up_canvas_w;
			// 渲染的高度是下面管子的高度 也就是下面管子的y值
			var down_canvas_h = down_img_h;
			this.ctx.drawImage(this.pipeArr[i].down,down_img_x,down_img_y,down_img_w,down_img_h,down_canvas_x,down_canvas_y,down_canvas_w,down_canvas_h);
			// this.ctx.fillText("x:"+up_canvas_x+"y"+0,up_canvas_x,20);
			// this.ctx.fillText("x:"+(up_canvas_x+up_img_w)+"y"+0,(up_canvas_x+up_img_w),20);
			// this.ctx.fillText("x:"+up_canvas_x+"y"+up_img_h,up_canvas_x,20+up_img_h);
			// this.ctx.fillText("x:"+(up_canvas_x+up_img_w)+"y"+up_img_h,(up_canvas_x+up_img_w),20+up_img_h);
			// 渲染金币
		  if(this.pipeArr[i].hasMedal){
		  		this.ctx.drawImage(this.pipeArr[i].medal,up_canvas_x,up_img_h+(150-this.pipeArr[i].medal.height)/2);
		  }
		}
	},
	// 渲染鸟
	renderBird:function(){
		// 鸟要旋转。第一步 先将鸟放到坐标系中心
		this.ctx.save();
		// 确定坐标系的y值
		var y = 0;
		if((178+this.bird.y)<0){
			y = 0;
			this.bird.state = "D";
			this.bird.f = 0;
		}else {
			y =178+this.bird.y
		}
		console.log(this.bird.f)
		// 更改坐标系   
		this.ctx.translate(125,y);
		// 判断鸟是否与管子碰到 
		// 鸟的B点x值 
		var bird_b_x  =  this.bird.x+this.bird.B.x+ 125 ;
		//管子的C点x值
		var up_pipe_c_x = this.ctx.canvas.width -(this.pipeArr[0].speed * this.pipeArr[0].iframe);
		// 鸟的B点的y值
		var bird_b_y = this.bird.B.y + y;
		// 管子的c点的y值
		var up_pipe_c_y = this.pipeArr[0].up_length;
		// 鸟的a点x值 
		var bird_a_x = this.bird.x + this.bird.A.x + 125;
		// 管子的D点的x值
		var up_pipe_d_x =  up_pipe_c_x+this.pipeArr[0].up.width;
		// 判断鸟是否与上面管子碰到  如果鸟的B点的x值大于管子的C点的x值 并且鸟的B点的y值小于管子的C点的Y值 并且鸟的A点的x值 小于管子的D点的x值 说明碰撞到了。
		if( bird_b_x>up_pipe_c_x && bird_b_y < up_pipe_c_y && bird_a_x < up_pipe_d_x ){
			clearInterval(this.timer);
		}
		// 判断鸟与下面管子的碰撞
		// 如果鸟的D点x值大于管子A点x值 并且 鸟的D点y值大于管子A点y值 并且鸟的C点x值小于管子B点x值
		var bird_d_x = bird_b_x; //B和D点x值一致
		var bird_d_y = y + this.bird.D.y ; 
		var bird_c_x = bird_a_x;
		var down_pipe_a_x = up_pipe_d_x-this.pipeArr[0].up.width ;
		var down_pipe_a_y = this.pipeArr[0].up_length+150;
		var down_pipe_b_x = up_pipe_d_x;
		if(bird_d_x > down_pipe_a_x && bird_d_y>down_pipe_a_y && bird_c_x < down_pipe_b_x){
			clearInterval(this.timer);
		}
		// // 判断地面
		if(bird_d_y>400){
			clearInterval(this.timer);
		}
		// 渲染鸟的时候先渲染四个点(辅助语句)
		// this.ctx.beginPath();
		// this.ctx.arc(this.bird.x+this.bird.A.x,this.bird.A.y,2,0,Math.PI*2);
		// this.ctx.closePath();
		// this.ctx.fill();
		// this.ctx.beginPath();
		// this.ctx.arc(this.bird.x+this.bird.B.x, this.bird.B.y,2,0,Math.PI*2);
		// this.ctx.closePath();
		// this.ctx.fill();
		// this.ctx.beginPath();
		// this.ctx.arc(this.bird.x+this.bird.C.x, this.bird.C.y,2,0,Math.PI*2);
		// this.ctx.closePath();
		// this.ctx.fill();
		// this.ctx.beginPath();
		// this.ctx.arc(this.bird.x+this.bird.D.x,this.bird.D.y,2,0,Math.PI*2);
		// this.ctx.closePath();
		// this.ctx.fill(); 
		// 判断鸟的状态决定角度的正负性
		if(this.bird.state ==="U"){
		   this.ctx.rotate(-this.bird.f*2/(180/Math.PI));// 之所以乘以2 是因为让鸟头看起来上扬的更大一点
		}else {
			 this.ctx.rotate(this.bird.f/(180/Math.PI));
		}
		if( this.pipeArr[0].hasMedal &&  bird_d_x>=down_pipe_a_x){
			// 吃到金币了 
			this.score += (this.pipeArr[0].idx+1);
			this.pipeArr[0].hasMedal  = false;
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
	},
	createPipe:function(){
		// 每当创建一个pipe 其实就是 创建一个Pipe对象并放入pipeArr中
		this.pipeArr.push(new Pipe(this.pipeArr[0].up,this.pipeArr[0].down,this.pipeArr[0].speed,this.pipeArr[0].medalArr))
	},
	welcome:function(){
		var me = this;
		// 让定时器执行 但是执行的内容不是start
		this.timer = setInterval(function(){
			me.frameNum++;
			// 每帧清屏
			me.clear();
			// 渲染背景
			me.renderBG();
			// 渲染地面
			me.renderLand();
			// 渲染title
			me.renderTitle();
			// 渲染tutorial
			me.renderTutorial();
		},20)
	},
	// 渲染标题
	renderTitle : function(){ 
		this.ctx.drawImage(this.title,(this.ctx.canvas.width - this.title.width)/2,this.frameNum>150?150:this.frameNum);
	},
	// 渲染引导图片
	renderTutorial:function(){
		// 等待标题落下之后再渲染
		var flag = this.frameNum>150?  true: false;
		if(flag){
			if(!(this.frameNum%10<5)){// 每10帧渲染前5帧 这样不会闪烁的频率太快
			this.ctx.drawImage(this.tutorial,(this.ctx.canvas.width - this.tutorial.width)/2,170+this.title.height)
			this.begin();// 绑定事件 之所以一开始不绑定是因为要等待引导页显示完毕
			}
		}
	},
	begin:function(){
		// 保存this
		var me = this;
		// 当点击闪烁的tutorial的时候开始游戏
		this.ctx.canvas.onclick =function(e){
			console.log(1)
			if(e.offsetX >(me.ctx.canvas.width - me.tutorial.width)/2 && e.offsetX<(me.ctx.canvas.width - me.tutorial.width)/2+me.tutorial.width && e.offsetY>(170+me.tutorial.height) && e.offsetY<(170+me.tutorial.height*2)){
				// 当点击区域的时候开始游戏
				me.start();
				// 绑定事件 此时这个事件将会失效 DOM0级
				me.bindEvent();
			}
		}
	},
	rendScore:function(){
		this.ctx.fillText(this.score,0,440);
	}
}