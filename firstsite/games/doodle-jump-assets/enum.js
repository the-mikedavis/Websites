var Const = Object.freeze({
	acceleration : 0.2,			//how quickly you fall
	jumpSensitivity : 9,		//how high you can jump
	horizontalSensitivity : 5,	//how quickly you can move to the sides
	platformSpacing : 150		//how far apart the platforms are
});

var Flux = {
	doodle : null,				//doodle object
	playingGame : false,		//boolean to pause the game
	deleteBool : false,			//boolean to delete past stages, build new ones
	platformJump : true,		//boolean to jump on platforms
	gameOver : false,			//boolean to stop a dead doodle
	resetGame : false,			//boolean to reset upon pressing enter
	jumpCount : 0,				//integer to count jumps made (progression)
};