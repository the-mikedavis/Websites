var platforms = [];	//this global variable is too used to be put in the enum

function setup() {
	createCanvas(400,800);
	noStroke();
	Flux.doodle = new Jumper(width/2, height/2);
	textAlign(CENTER);
	platforms.push(new Platform(width/2, height/2, width/4));	//inital platform to 
	for (var count = 1; count <= 5; count++){
		platforms.push(new Platform(getRandom(width/8,width-width/8), height/2-Const.platformSpacing*count, width/4));
	}
	frameRate(60);
}

function draw() {
	if (Flux.playingGame && !Flux.gameOver){
		background(220);
		textAlign(LEFT);
		text(Flux.jumpCount, 20, 20);
		
		if (keyIsDown(RIGHT_ARROW))
			Flux.doodle.moveRight();
		else if (keyIsDown(LEFT_ARROW))
			Flux.doodle.moveLeft();
		
		//Code to draw a new platform and delete the last one:
		if (Flux.deleteBool){
			platforms.shift();
			platforms.push(new Platform(getRandom(width/8,width-width/8), (platforms[platforms.length-1].y - Const.platformSpacing), width/4));
			platforms[platforms.length-1].y = platforms[platforms.length-2].y - Const.platformSpacing;//sync heights
			platforms[platforms.length-1].yVelocity = platforms[platforms.length-2].yVelocity;	//sync velocities
			Flux.deleteBool = false;
		}
		//Mechanism to jump:
		for (var i = 0; i < platforms.length; i++){
			if (platforms[i].yVelocity <= 0 && //it's falling
				Flux.doodle.y <= platforms[i].y + 10 && Flux.doodle.y >= platforms[i].y - 10 && //it's in the y vicinity
				Flux.doodle.x >= platforms[i].x - platforms[i].length / 2 && Flux.doodle.x <= platforms[i].x + platforms[i].length / 2){	//it's in the x vicinity
					Flux.platformJump = true;
					Flux.jumpCount++;
			}
			if (platforms[i].y >= height){	//if a platform is off the map, delete it
				Flux.deleteBool = true;
			}
		}
		//if it's time to jump:
		if (Flux.platformJump){
			for (i = 0; i < platforms.length; i++)
				platforms[i].jump();
			Flux.platformJump = false;
		}
		
		//draw: the platforms
		for (i = 0; i < platforms.length; i++){
			platforms[i].draw();
			//console.log("drawing platform "+i);
		}
		Flux.doodle.draw();//draw the jumper
		if (platforms[0].y <= 0)
			Flux.gameOver = true;
	} else if (Flux.gameOver){
		textAlign(CENTER);
		background(220);
		text("Press Return to restart", width/2, height/2 - 25);
		if (Flux.resetGame){
			while (platforms.length >= 1){	//delete the previous platforms
				platforms.shift();
			}
			Flux.gameOver = false;
			Flux.jumpCount = 0;
			Flux.doodle.x = width/2;
			Flux.deleteBool = false;
			Flux.playingGame = false;
			platforms.push(new Platform(width/2, height/2, width/4));
			for (var count = 1; count <= 5; count++){
				platforms.push(new Platform(getRandom(width/8,width-width/8), height/2-Const.platformSpacing*count, width/4));
			}
		}
	} else {
		if (Flux.doodle.x == width/2)
			background(220);
		textAlign(CENTER);
		text("Press Space to play", width/2, height/2 - 50);
	}
}

function keyPressed(){
	if (key == " ")
		Flux.playingGame ^= true;
	else if (key == "\r")
		Flux.resetGame = true;
}

function Jumper(x, y){//The jumper can move left and right but stays at the middle height
	this.x = x;
	this.y = y;
	
	this.draw = function(){
		fill(110);
		noStroke();
		
		ellipse(this.x, this.y, 20, 20);
	}
	
	this.moveRight = function(){
		if (this.x < width-10)
		this.x += Const.horizontalSensitivity;
	}

	this.moveLeft = function(){
		if (this.x > 10)
		this.x -= Const.horizontalSensitivity;
	}
}

function Platform(x, y, length){//the platforms are the ones which jump
	this.x = x;
	this.y = y;
	this.length = length;
	this.yVelocity = 0;

	this.draw = function(){
		stroke(10);
		strokeWeight(10);
		
		this.y += this.yVelocity;
		this.yVelocity -= Const.acceleration;
		
		line(this.x - this.length/2, this.y, this.x + this.length/2, this.y);
	}
	this.jump = function(){
		this.yVelocity = Const.jumpSensitivity;
	}
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}