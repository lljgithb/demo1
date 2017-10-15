function Animal(pics){
  this.pics = pics;
  this.idx = parseInt(Math.random()*this.pics.length);
  this.pic = this.pics[this.idx];
  this.width = this.pic.width/5;
  this.state = 0;
  this.lifeNum = 0;
  this.wholeLife = 50;
  this.alive = true;
}
Animal.prototype = {
	constructor:Animal,
	init:function(){
		this.idx = parseInt(Math.random()*this.pics.length);
	  this.pic = this.pics[this.idx];
	  this.width = this.pic.width/5;
	  this.state = 0;
	  this.lifeNum = 0; 
	  this.alive = true;
	},
	growUp:function(){
		this.lifeNum++;
		this.update(); 
	},
	update:function(){
		if(this.lifeNum<10){
			this.state = 0;
		}else if(this.lifeNum<20){
			this.state = 1;
		}else{
			if(this.alive){
		  	this.state = this.lifeNum %2 ? 2 : 3; 	
			}
		} 
	},
	goDie:function(){
		this.alive = false;
    this.state = 4;
    this.lifeNum = 40;
	}
}