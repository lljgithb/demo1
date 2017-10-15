// Game类 用来操作整个游戏
function Game(ctx,bj,logo,ui,animal,hammer,life,life1,life_num,score_img,cw,cwk,audio){
	// 刷子 
	this.ctx = ctx;
	// 背景
	this.bj = bj;
	// logo
	this.logo = logo;
	// ui图片
	this.ui = ui;
	// 动物对象
	this.animal = animal;
	// 心图片
	this.life_heart = life;
	// 心乘号
	this.life_1 = life1;
	// 心数字图片
	this.life_num = life_num;
	// 分数图片（蓝色）
	this.score_img = score_img;
	// 重玩图片
	this.cw=  cw;
	// 重玩框
	this.cwk = cwk;
	// audio元素 用来播放背景音乐
	this.audio = audio;
	// 菜单面板小锤子的坐标
	this.xiaozhuizi_position = [ this.ctx.canvas.height-20-20,this.ctx.canvas.height-20-20-16]
  // 小锤子的序号 表示当前锤子在哪个坐标
  this.xiaozhuizi_idx = 0;
  // 洞的位置 位于地图上
	this.positionArr = [
		{
			x:90,
			y:48
		},
		{
			x:10,
			y:110
		},
		{
			x:90,
			y:110
		},
		{
			x:170,
			y:110
		},
		{
			x:90,
			y:178
		}
	];
	// 锤子图片
	this.hammer = hammer;
	// 游戏开关标记 
	this.flag = false;
	// 分数
	this.scores = 0;
	// 生命数
	this.life = 10;
	// 地鼠位于哪个洞中的索引值
	this.idx = parseInt(Math.random()*this.positionArr.length)
	// 主频率
	this.iframe = 0;
	// 锤子的最大上限时间 20 帧 
	this.hammerMax = 20;
	// 是否渲染锤子锁
	this.rendHammerLock  = false;
	// 用于计算锤子的帧数 
	this.hammer_frame = 0;
	// 用于记录锤子的位置 
	this.hammerPosition = null;
	// 重玩面板是否显示 
	this.cwState = false;
	// 是否重玩标记 表示显示重玩面板的时候 重玩框位于是还是否
	this.shifouchongwan = true;
	// 声音开关
	this.music = false;
	// 菜单开关
	this.menu = false;
}
// 方法写在原型上
Game.prototype = {
	constructor:Game,
	// 初始化方法
	init: function(){
		this.flag = false;
		this.scores = 0;
		this.life = 1;
		this.idx = parseInt(Math.random()*this.positionArr.length)
		this.iframe = 0;
		this.hammerMax = 20;
		this.rendHammerLock  = false;
		this.hammer_frame = 0;
		this.hammerPosition = null;
		this.cwState = false;
		this.animal.init();
		this.shifouchongwan = true;

	},
	// rendBJ : function(){
	// 	this.ctx.drawImage(this.bj,0,0);
	// },
	// 渲染logo
	rendLogo:function(){
		this.ctx.drawImage(this.logo,0,0);
	},
	// 渲染开始游戏文字
	rendStartText:function(){
		this.ctx.drawImage(this.ui,0,0,60,16,(this.ctx.canvas.width-60)/2,180,60,16);
	},
	// 绑定事件
	bindEvent:function(){
		// 备份this
		var me  = this;
		// 绑定事件
		document.onkeydown = function(e){
			// 当主菜单没有显示 并且按下回车键 并且游戏没有开始 并且重玩框没有显示的时候
			if(!me.menu && e.keyCode === 13 && !me.flag && !me.cwState){
				// 开始游戏
				me.start();
				// 将游戏开关标记为开始游戏
				me.flag = true;
				// 返回
				return;
			}
			// 如果游戏已经开始 并且没有显示主菜单 并且按下了上下左右空格中的任意一个键的时候
			if(!me.menu && me.flag && (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 32)){
				// 调用check方法 检测是否打中地鼠
				me.check(e.keyCode);
				return;
			} 
			// 如果游戏结束 并且 cw和cwk显示 此时按左右 要更改cwk的位置
			if(!me.menu && !me.flag && me.cwState){
			  // 如果按下的是左箭头 要显示重玩框在左边
				if(e.keyCode=== 37 ){
			  	me.rendCW();
			  	me.rendCWK(true);
			  	me.shifouchongwan = true;
			  }else if(e.keyCode === 39){// 如果按下的是右箭头 显示重玩框在右边
			  	me.rendCW();
			  	me.rendCWK(false);
			  	me.shifouchongwan = false;
			  } 
			  // 如果按下的是回车键并且光标在左边 
			  if(e.keyCode === 13 &&  me.shifouchongwan){
					// 重玩
					me.init();
					me.start();

				}else if(e.keyCode === 13 && !me.shifouchongwan){// 如果按下的是回车键并且光标在右边
					// 不重玩
					me.clear();
					me.init();
					me.rendLogo();
					me.rendStartText();
				}
			  return;
			}  
			// 不管游戏是否进行 当点击alt键的时候直接弹出 如果游戏没有进行 如果游戏进行 则停止
			if(!me.menu && e.keyCode === 18){
				// 阻止默认事件 因为按alt键的时候浏览器有其它事情
				e.preventDefault();
				// 判断游戏是否进行
				if(me.flag){
					// 游戏正在进行 则停止
					clearInterval(me.timer);
				} 
				me.menu = true;
				me.rendMenu();
				return;
			}
			// 如果当前是打开着的菜单 并且用户又按下alt键 则关闭菜单
			if(me.menu && e.keyCode === 18){
				e.preventDefault();
				me.menu = false;
				me.rendMenu();
				// 判断打开菜单的时候游戏是否在进行 如果没有进行游戏则无操作 否则继续游戏
				if(me.flag){
					me.start();
				}
				return;
			}
			// 当菜单是打开着的 按上箭头 应该移动小锤子
			if(me.menu && e.keyCode === 38){ 
				// 移动小锤子 并重绘菜单
				me.xiaozhuizi_idx ++; 
				if(me.xiaozhuizi_idx >= me.xiaozhuizi_position.length){
					me.xiaozhuizi_idx = 0;
				}
				me.rendMenu();
				return;
			}else if(me.menu && e.keyCode === 40){
				// 移动小锤子 并重绘菜单
				me.xiaozhuizi_idx --; 
				if(me.xiaozhuizi_idx <0 ){
					me.xiaozhuizi_idx = me.xiaozhuizi_position.length-1;
				}
				me.rendMenu();
				return;
			}
			// 如果菜单是打开着的并且按下回车键 
			if(me.menu && e.keyCode === 13){
				if(me.xiaozhuizi_idx === 0){
					// 切换音乐开关
					me.music = !me.music;
					me.playMusic();
					me.rendMenu();
				}
				// 如果是继续游戏 
				if(me.xiaozhuizi_idx === 1){
					// 开始游戏
					me.start();
					// 菜单关闭
					me.menu = false;
				}
				return;
			}
		}
	},
	// 清空整个画布
	clear:function(){
		this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
	},
	// 开始游戏 游戏主循环函数
	start:function(){
		// 保存this
		var me=  this;
		// 将游戏开关标记为开始
		me.flag = true;
		// 清除之前的定时器 防止累加
		clearInterval(this.timer);
		// 赋值定时器
		this.timer = setInterval(function(){
			// 清屏
			me.clear();
			// 帧编号自加
			me.iframe++;
			// me.rendBJ();
			// 绘制动物
			me.rendAnimal();
			// 根据锤子锁决定是否绘制锤子
			if(me.rendHammerLock){
				// 锤子的帧编号自加
				me.hammer_frame ++ ;
				// 渲染锤子方法
				me.rendHammer(me.hammer_frame>me.hammerMax/2?false:true,me.hammerPosition.x,me.hammerPosition.y);
				// 如果锤子的编号已经超时 则关闭锤子锁
				if(me.hammer_frame>=me.hammerMax){
					me.rendHammerLock =false;
					me.hammer_frame = 0;
				}
			}
			// 减慢地鼠的生长速度
			if(me.iframe%2){
				me.animal.growUp();
			}
			// 判断地鼠是否死亡 如果死亡则重置地鼠
			if(me.animal.lifeNum >= me.animal.wholeLife){
				// 重置地鼠
				me.animal.init();  
				// 给地鼠换洞
				me.idx = parseInt(Math.random()*me.positionArr.length)
			}
			// 渲染心图片
			me.rendHeart();
			// 渲染生命图片
			me.rendLife1();
			// 渲染心的条数
			me.rendHeartNum();
			// 渲染当前分数
			me.rendScores(); 
		},20)
	},
	// 渲染动物
	rendAnimal:function(){
		// 渲染动物 要根据洞的位置和地鼠的状态来进行渲染
		this.ctx.drawImage(this.animal.pic,this.animal.state*this.animal.width,0,this.animal.width,60,this.positionArr[this.idx].x,this.positionArr[this.idx].y,60,60);
	},
	// 检测方法 看是否打中地鼠
	check : function(keyCode){
		if(keyCode === 37 && this.idx === 1  && this.animal.alive){
			// 打死地鼠
			this.animal.goDie();
			if(this.animal.idx === 2){
				// 说明是兔子 要减心
				this.life --;
			}else{
				this.scores += (this.animal.idx+1)
			}
		}else if(keyCode === 38 && this.idx === 0  && this.animal.alive){
			this.animal.goDie();
			if(this.animal.idx === 2){
				// 说明是兔子 要减心
				this.life --;
			}else{
				this.scores += (this.animal.idx+1)
			}
		}else if(keyCode === 39 && this.idx === 3  && this.animal.alive){
			this.animal.goDie();
			if(this.animal.idx === 2){
				// 说明是兔子 要减心
				this.life --;
			}else{
				this.scores += (this.animal.idx+1)
			}
		}else if(keyCode === 40 && this.idx === 4  && this.animal.alive){
			this.animal.goDie();
			if(this.animal.idx === 2){
				// 说明是兔子 要减心
				this.life --;
			}else{
				this.scores += (this.animal.idx+1)
			}
		}else if(keyCode === 32 && this.idx === 2  && this.animal.alive){
			this.animal.goDie();
			if(this.animal.idx === 2){
				// 说明是兔子 要减心
				this.life --;
			}else{
				this.scores += (this.animal.idx+1)
			}
		} 
		// 检测游戏的可玩次数如果小于0 （this.life < 0）
		if(!this.life){
			// alert("Game Over");
			// 停止游戏
			clearInterval(this.timer);
			// 提示重玩
			this.rendCW();
			// 渲染重玩框
			this.rendCWK(true);
			// 将游戏标记为false
			this.flag = false;
			// 因为显示了重玩框 所以更改重玩面板状态
			this.cwState= true;
		}
		// 打开锤子锁
		this.rendHammerLock = true;
		// 确定按下的键是哪个 用来确定锤子应该渲染的位置 
		if(keyCode === 37){
			this.hammerPosition = this.positionArr[1];
		}else if(keyCode === 38){
			this.hammerPosition = this.positionArr[0];
		}else if(keyCode === 39){
			this.hammerPosition = this.positionArr[3];
		}else if(keyCode === 40){
			this.hammerPosition = this.positionArr[4];
		}else if(keyCode === 32){
			this.hammerPosition = this.positionArr[2];
		}
	},
	// 渲染锤子 需要传递三个参数， 第一个决定是渲染锤子还是渲染星星 第二个决定将锤子渲染在哪个x点 第三个决定将锤子渲染在哪个y点
	rendHammer:function(bool,x,y){
		this.ctx.drawImage(this.hammer, bool ? 0:74 ,0,74,60,x,y,74,60);
	},
	// 渲染分数
	rendScores : function(){
		// 先转成字符串
		var a = this.scores +"";
		// 转成数组
    a = a.split("");
    // 逆序
    a.reverse();
    // 循环渲染
    for(var i =a.length;i>=0;i--){
        this.ctx.drawImage(this.score_img, a[i] * 12,0,12,15,this.ctx.canvas.width-12*(i+1) ,this.ctx.canvas.height-15,12,15);
    } 
	},
	// 渲染心型
	rendHeart :function(){
		this.ctx.drawImage(this.life_heart,5,5);
	},
	// 渲染乘号
	rendLife1: function(){
		this.ctx.drawImage(this.life_1,5+this.life_heart.width + 5 ,5)
	},
	// 渲染心的数量
  rendHeartNum : function(){
     var a = this.life +"";
     a = a.split("");
     for(var i =0;i<a.length;i++){
     	   this.ctx.drawImage(this.life_num,a[i]*12,0,12,15,5+this.life_heart.width + 5+this.life_1.width+4 + 12*i ,5,12,15);
     }
  },
  // 渲染重玩
  rendCW :function(){
  	this.ctx.drawImage(this.cw,(this.ctx.canvas.width - this.cw.width)/2,(this.ctx.canvas.height-this.cw.height)/2);
  },
  // 渲染重玩框
  rendCWK : function(bool){
  	if(bool){
  	 this.ctx.drawImage(this.cwk,(this.ctx.canvas.width - this.cw.width)/2+16,(this.ctx.canvas.height-this.cw.height)/2+67);
  	}else{
  	 this.ctx.drawImage(this.cwk,(this.ctx.canvas.width - this.cw.width)/2+53,(this.ctx.canvas.height-this.cw.height)/2+67);
  	}
  },
  // 渲染菜单
  rendMenu:function(){
  	if(!this.menu){
  	  this.ctx.clearRect(0,216,86,1000);
  		return;
  	}
  	// 清除一部分区域 
  	this.ctx.clearRect(0,216,86,1000);
  	this.ctx.drawImage(this.ui,120,64,30,16,5+20,this.ctx.canvas.height-20-20,30,16);
  	// 游戏继续
  	this.ctx.drawImage(this.ui,120,0,60,16,5+20,this.ctx.canvas.height-20-20-16,60,16)
  	// 声音开关 
  	// 如果声音是开着的要显示开那个图片
  	if(this.music){
  		this.ctx.drawImage(this.ui,150,64,15,16,35+20,this.ctx.canvas.height-20-20,15,16)
  	}else{
  		this.ctx.drawImage(this.ui,172,64,15,16,35+20,this.ctx.canvas.height-20-20,15,16)
  	}
  	// 绘制锤子
  	this.ctx.drawImage(this.ui,240,48,15,16,5,this.xiaozhuizi_position[this.xiaozhuizi_idx],15,16);
  },
  // 播放音乐
  playMusic : function(){
  	if(this.music){
  		this.audio.play();
  	}else {
  		this.audio.pause();
  	}
  }
}