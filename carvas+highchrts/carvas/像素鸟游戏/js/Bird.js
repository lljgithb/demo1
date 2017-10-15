function Bird(imgArr){
	// 图片数组  里面有鸟的三个图片 连起来是飞翔的动作
	this.imgArr = imgArr;
	// 索引  
	this.idx = 0;
	// 高度属性 
	this.height  = this.imgArr[this.idx].height;
	// 宽度属性
	this.width =  this.imgArr[this.idx].width;
	// 鸟的纵坐标值
	this.y = 0;
	// 鸟的横坐标值
	this.x = 0;
	// 定义一个属性决定鸟的判定位置宽度
	this.panding = 15;
  // 定义一个小变量 用来计算鸟应该下落的位置
  this.f = 0;
  // 定义鸟的四个点 每个点由x,y组成 但是这里的ABCD表示的不是四个点的位置。而是这四个点距离鸟的x 、y所在的距离
  this.A = {
  	x:-this.panding,
  	y:-this.panding
  };
  this.B ={
  	x:this.panding,
  	y:-this.panding
  };
  this.C = {
  	x:-this.panding,
  	y:this.panding
  };
  this.D = {
  	x:this.panding,
  	y:this.panding
  } 
  // 定义一个状态 如果鸟的状态是上升 那么这个f决定鸟的上升速度
  // 如果鸟的状态是下降那么这个f决定鸟的下降速度
  this.state = "D"; // U 上升 D 下降
}
// 方法写在原型上
Bird.prototype = {
	constructor:Bird,
	// 煽动翅膀的方法 具体表现就是更新this.idx值
	swing:function(){
		this.idx++; 
		// 判定合法
		if(this.idx >=this.imgArr.length){
			this.idx=0;
		} 
	},
	// 能量方法   点击之后 改变状态 f变为15 然后自减
	energy:function(){
	   this.state = "U";
	   this.f = 15;
	},
	go:function(){
		// 如果状态是下落，则f++ 然后改变y值。
		 if(this.state === "D"){
		 this.f++;
		  this.y+=Math.sqrt(this.f);
		 }else if(this.state ==="U") {
		 	// 如果状态是上升。则f-- 然后改变y值。
		 	this.f--;
		 	if(this.f ===0){// 如果自减到0 那么状态改变为下落
		 		this.state = "D"; 
		 	}
		 	this.y-= (Math.sqrt(this.f));
		 }
	} 
}