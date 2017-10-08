var pacman;
var dimension;			//a scalar to create a plane on which pacman moves
var startArc = [];
var ghostColors = ["red","orange","pink","blue"];
var cornersX = [5,35,5,35];
var cornersY = [5,5,35,35];
var endArc = [];
var ghosts = [];		//array of ghost objects
var biteSpeed;
var cnvs;
var frameStart = 0;
var mapImage;
var mapFile = '/dist/pacman/myMap.JPG';
var pacCounter = 0;
var gameOver = false;
var winningString = "";
var ghostCount = 4;	//between 1 and 4

function setup() {
	cnvs = createCanvas(600,500);
	biteSpeed = PI/16;					//how much the pacman can open his mouth
	dimension = 0.025*width;			//set up the scalar for a changeable canvas size
	createMap();						//create the map on the canvas from the ternary map
	//saveCanvas(mapFile);				//save the canvas to use the map with low impact
	mapImage = loadImage(mapFile);		//load in that image
	for (var count = 0; count < 6; count++){
		pacMap[17][16+count] = 0;
	}
	noStroke();
	frameRate(10);
	pacman = new Pacman(19*dimension, 26*dimension);
	for (count = 0; count < ghostCount; count++)				//push ghosts onto the array
		ghosts.push(new Ghost(18*dimension + count*dimension, 15*dimension, ghostColors[count], count));
	startArc = [
			17*PI/16,
			PI/16,
			25*PI/16,
			9*PI/16
		];
	endArc = [
			15*PI/16,
			31*PI/16,
			23*PI/16,
			7*PI/16
		];
}

function draw() {
	image(mapImage, 0, 0, width, height);
	if (frameCount == 5 || frameCount == 10)
		for (var count = 0; count < 6; count++)
			pacMap[17 - frameCount/5][16+count] = 0;
	
	if (frameCount - frameStart == 40)
		setAllMovements("CHASE");
	//control functions
	if (!gameOver){	//playing the game
		if ((frameCount & 1) === 0){		//test all ghost paths and move accordingly
			for (var count = 0; count < ghosts.length; count++)
				ghosts[count].testPaths();
		}
				//allow the pacman to move
		if (keyIsDown(LEFT_ARROW))
			pacman.move(0);
		else if (keyIsDown(RIGHT_ARROW))
			pacman.move(1);
		if (keyIsDown(UP_ARROW))
			pacman.move(2);
		else if (keyIsDown(DOWN_ARROW))
			pacman.move(3);
	}
	else{			//game is over
		fill(250);
		textAlign(RIGHT);
		text(winningString, width/2, height/2);
	}
	drawDots();		//orange dots
	textAlign(LEFT);
	text(pacCounter, 20, 20);	//how many dots you've eaten
	var ghostKiller = null;
	for (count = 0; count < ghosts.length; count++){
		if (ghosts[count].pacX == pacman.pacX && ghosts[count].pacY == pacman.pacY){//you've lost
			if (ghosts[count].moveType == "FRIGHT")
				ghostKiller = count;
			else {
				gameOver = true;
				winningString = "You Lose!";
			}
		}
	}
	if (ghostKiller !== null)
		ghosts.pop(ghostKiller);
	for (count = 0; count < ghosts.length; count++)
		ghosts[count].draw();
	if (pacCounter == 298){
		gameOver = true;
		winningString = "You Win!";
	}

	pacman.draw();
}

function Pacman(x, y) {
	this.x = x;
	this.y = y;
	this.size = dimension;
	this.orientation = 0;
	this.pacX = int(this.x/dimension);
	this.pacY = int(this.y/dimension);
	
	this.move = function(direction){
		this.pacX = int(this.x/dimension);
		this.pacY = int(this.y/dimension);
		if (pacMap[this.pacY][this.pacX] == 2){
			pacMap[this.pacY][this.pacX]--;	//delete dots when hit
			pacCounter++;//there are 312 dots in this map.
		}
		else if (pacMap[this.pacY][this.pacX] == 3){ //random motion of the ghosts, invincibility, etc.
			pacMap[this.pacY][this.pacX] = 1;
			frameStart = frameCount;
			setAllMovements("FRIGHT");
			pacCounter++;
		}
		this.orientation = direction;
		switch(direction){
			case 0 : //left
				if (pacMap[this.pacY][this.pacX - 1] > 0) this.x -= dimension;	break;
			case 1 : //right
				if (pacMap[this.pacY][this.pacX + 1] > 0) this.x += dimension;	break;
			case 2 : //up
				if (pacMap[this.pacY - 1][this.pacX] > 0) this.y -= dimension;	break;
			case 3 : //down
				if (pacMap[this.pacY + 1][this.pacX] > 0) this.y += dimension;	break;
			default : break;
		}
		if (this.pacX == 5 && this.pacY == 16){
			this.pacX = 33;
			this.x = this.pacX * dimension;
		} else if (this.pacX == 34 && this.pacY == 16){
			this.pacX = 6;
			this.x = this.pacX * dimension;
		}
	}
	
	this.draw = function(){
		fill(color("yellow"));
		noStroke();
		arc(this.x, this.y, this.size, this.size, 
			startArc[this.orientation] + biteSpeed*sin(2*PI/5*(frameCount % 5)), 
			endArc[this.orientation] - biteSpeed*sin(2*PI/5*(frameCount % 5)));
	}
}

function Ghost(x, y, gColor, count){
	this.x = x;
	this.y = y;
	this.gColor = gColor;
	this.size = dimension;
	this.ghostNo = count;
	this.orientation = 0;
	this.pacX;
	this.pacY;
	this.moveType = "SCATTER";	//possible types are CHASE, SCATTER, and FRIGHT
	this.previousPath = null;
	
	this.testPaths = function(){
		this.pacX = int(this.x/dimension);
		this.pacY = int(this.y/dimension);
		var targetX = null;
		var targetY = null;
		var distance = 1000;
		var possiblePath = null;
		var pathArray = [];
		switch(this.moveType){
			case "CHASE" : 
				targetX = pacman.pacX;
				targetY = pacman.pacY;
			case "SCATTER" :
				if (targetX === null && targetY === null){
					targetX = cornersX[this.ghostNo];
					targetY = cornersY[this.ghostNo];
				}
				if (pacMap[this.pacY][this.pacX-1] > 0 &&
						this.previousPath != 1){	//left
					distance = dist(this.pacX-1, this.pacY, targetX, targetY);
					possiblePath = 0;
				}
				if (pacMap[this.pacY][this.pacX+1] > 0 && 
						dist(this.pacX+1, this.pacY, targetX, targetY) < distance &&
						this.previousPath !== 0) {//right
					distance = dist(this.pacX+1, this.pacY, targetX, targetY);
					possiblePath = 1;
				}
				if (pacMap[this.pacY-1][this.pacX] > 0 && 
						dist(this.pacX, this.pacY-1, targetX, targetY) < distance &&
						this.previousPath != 3) {//up
					distance = dist(this.pacX, this.pacY-1, targetX, targetY);
					possiblePath = 2;
				}
				if (pacMap[this.pacY+1][this.pacX] > 0 && 
						dist(this.pacX, this.pacY+1, targetX, targetY) < distance && 
						this.previousPath != 2) {//down
					distance = dist(this.pacX, this.pacY+1, targetX, targetY);
					possiblePath = 3;
				}
				if (possiblePath !== null){
					this.move(possiblePath);
					this.previousPath = possiblePath;
				}
				break;
			case "FRIGHT" :
				if (pacMap[this.pacY][this.pacX-1] > 0 && this.previousPath != 1)	//left
					pathArray.push(0);
				if (pacMap[this.pacY][this.pacX+1] > 0 && this.previousPath !== 0)	//right
					pathArray.push(1);
				if (pacMap[this.pacY-1][this.pacX] > 0 && this.previousPath != 3)	//up
					pathArray.push(2);
				if (pacMap[this.pacY+1][this.pacX] > 0 && this.previousPath != 2)	//down
					pathArray.push(3);
				var path = random(pathArray);
				this.move(path);
				this.previousPath = path;
				break;
		}
	}
	this.setMovementType = function(type){
		this.moveType = type;
		//reverse direction:
		switch(this.previousPath){
			case 0 : this.move(1);	break;
			case 1 : this.move(0);	break;
			case 2 : this.move(3);	break;
			case 3 : this.move(2);	break;
		}
	}

	this.move = function(direction){
		this.pacX = int(this.x/dimension);
		this.pacY = int(this.y/dimension);
		this.orientation = direction;
		switch(direction){
			case 0 : this.x -= dimension;	break;	//left
			case 1 : this.x += dimension;	break;	//right
			case 2 : this.y -= dimension;	break;	//up
			case 3 : this.y += dimension;	break;	//down
		}
		if (this.pacX == 5 && this.pacY == 16){
			this.pacX = 33;
			this.x = this.pacX * dimension;
		} else if (this.pacX == 33 && this.pacY == 16){
			this.pacX = 6;
			this.x = this.pacX * dimension;
		}
	}
	
	this.draw = function(){
		if (this.moveType == "FRIGHT")
			fill(color("purple"));
		else
	 		fill(color(this.gColor));
		noStroke();
		ellipse(this.x, this.y, this.size, this.size);
	}
}

function createMap(){
	background(220);
	stroke(0);
	strokeWeight(20);
	strokeJoin(MITER);
	strokeCap(PROJECT);
	//horizontals go rightwards, verticals go downwards
	for (var i = 0; i < pacMap.length; i++){
		for (var j = 0; j < pacMap[i].length; j++){
			if (pacMap[i][j] > 0 && pacMap[i][j+1] > 0)//horizontal line
				line(j*dimension, i*dimension, (j+1)*dimension, i*dimension);
			if (pacMap[i][j] > 0 && pacMap[i+1][j] > 0)//vertical line
				line(j*dimension, i*dimension, j*dimension, (i+1)*dimension);
		}
	}
}

function drawDots(){
	fill(color("orange"));
	noStroke();
	for (var i = 0; i < pacMap.length; i++){
		for (var j = 0; j < pacMap[i].length; j++){
			if (pacMap[i][j] == 2) ellipse(j*dimension, i*dimension, 5, 5);
			else if (pacMap[i][j] == 3) ellipse(j*dimension, i*dimension, 10, 10);	//biggest dots
		}
	}
}

function setAllMovements(type){
	for (var count = 0; count < ghosts.length; count++) 
		ghosts[count].setMovementType(type);
}

function reinitialize(){
	//code to restart the game and reinitialize all variables back to start-game variables.	
}
