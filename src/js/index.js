// Javascript Entry Point
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;


/////sends the ball off in two different directions at start
function pickXDirection(){
    var speeds = [2.5, -2.5];
    if (Math.random() < 0.5){
                return speeds[0];
            }else{
                return speeds[1];
            }
        };

var dx = pickXDirection();

///y doesn't need a random start direction. Ball starts right above the paddle-would be a very short game half the time.
var dy = -3;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

////buffer eliminates the frustration I always have with these games where I am 100% certain the ball hit the corner of the paddle
var buffer = 8;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 1;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 60;
var brickOffsetLeft = 40;
var score = 0;
var reset = 0;
var level = 1;
var audio = new Audio('../images/bow.mp3');

/////builds the rows and columns of bricks
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#F28328";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#F28328";
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
        	if(bricks[c][r].status == 1) {
	            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
	            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
	            bricks[c][r].x = brickX;
	            bricks[c][r].y = brickY;
	            ctx.beginPath();
	            ctx.rect(brickX, brickY, brickWidth, brickHeight);
	            ctx.fillStyle = "#0095DD";
	            ctx.fill();
	            ctx.closePath();
        	}
        }
    }
}

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    audio.play();
                    b.status = 0;
                    score++;
                    reset++;
                    if(reset == brickRowCount*brickColumnCount) {

                        /////adds another row of bricks and multiplies ball speed every time the players beats a level
                        reset = 0;
                        dx *= 1.1;
                        dy *= 1.1;
                        level++;
                        brickRowCount++;
                        bricks = [];
                        for(var c=0; c<brickColumnCount; c++) {
                            bricks[c] = [];
                            for(var r=0; r<brickRowCount; r++) {
                                bricks[c][r] = { x: 0, y: 0, status: 1 };
                            }
                        }

                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
    ctx.fillText("Level: "+level, canvas.width - 80, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX - buffer && x < paddleX + paddleWidth + buffer) {
           if(y= y-paddleHeight){
            dy = -dy  ;
			 }
        }
        else {
            console.log("GAME OVER");
            clearInterval(runningTheGame);
            window.location.reload(true);
        }
    }
    
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 4;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 4;
    }
    
    x += dx;
    y += dy;
}

var runningTheGame = setInterval(draw, 10);
