function Bird(imgArr){
	this.imgArr = imgArr;
	this.idx = 0;
	this.height  = this.imgArr[this.idx].height;
	this.width =  this.imgArr[this.idx].width;
	// 鸟的纵坐标值
	this.y = 0;
  // 定义一个小变量 用来计算鸟应该下落的位置
  this.f = 0;
  // 定义一个状态 如果鸟的状态是上升 那么这个f决定鸟的上升速度
  // 如果鸟的状态是下降那么这个f决定鸟的下降速度
  this.state = "D"; // U 上升 D 下降
}
// 方法写在原型上
Bird.prototype = {
	constructor:Bird,
	swing:function(){
		this.idx++; 
		if(this.idx >=this.imgArr.length){
			this.idx=0;
		} 
	},
	// 能量方法   点击之后 改变状态 f归零
	energy:function(){
	   this.state = "U";
	   this.f = 15;
	},
	go:function(){
		 if(this.state === "D"){
		 this.f++;
		  this.y+=Math.sqrt(this.f);
		 }else if(this.state ==="U") {
		 	this.f--;
		 	if(this.f ===0){
		 		this.state = "D"; 
		 	}
		 	this.y-= (Math.sqrt(this.f));
		 }
	} 
}