const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


// Bollens position och rörelse
let x = canvas.width / 2;
let y = canvas.height - 30;
let ballSpeed = 3;
let dx = ballSpeed * ((Math.round(Math.random()) * 2 - 1) * (Math.random() + 0.5)); // Rörelse i x-led
let dy = ballSpeed * ((Math.round(Math.random()) * 2 - 1) *(Math.random() + 0.5)); // Rörelse i y-led
const ballRadius = 10;

// Paddelns position och storlek
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 5;
const paddleSpeed = 7;

// Tangenttryck
let rightPressed = false;
let leftPressed = false;
let rPressed = false;

// Gameloop
let gamePaused = true;
let gameEnd = false;
let pString = "play";

// Brickor
const brickRowCount = 5;
const brickColumnCount = 6;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 35;
let bricks = [];
let score = 0;
let highScoreBreakout = localStorage.getItem("highScoreBreakout") || 0;

// Initiera brickor
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }; // status = 1 innebär att brickan finns
  }
}

// Hitta CSS-färger
let primaryColor;
let secondaryColor;

function getCSSVariable(varName) {
  return getComputedStyle(document.body).getPropertyValue(varName).trim();
}

// Hämta färgerna från CSS
function updateColors() {
  primaryColor = getCSSVariable("--primary-color");
  secondaryColor = getCSSVariable("--secondary-color");
}

// Gör funktionen global så att den kan anropas från andra skript
window.updateColors = updateColors;
updateColors();


// Lyssna på tangenttryck
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.getElementById("reset").addEventListener("click", () => resetGame());

function keyDownHandler(event) {
  if (event.key === 'ArrowRight') {
    rightPressed = true;
  } else if (event.key === 'ArrowLeft') {
    leftPressed = true;
  } else if ((event.key === "P") || (event.key === "p")){
    if (!gameEnd)
    {
      gamePaused = !gamePaused;

      if (pString == "play")
        pString = "pause";
      else if (pString == "pause")
        pString = "play";
    }
        
  } else if ((event.key === "R") || (event.key === "r")){
    rPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.key === 'ArrowRight') {
    rightPressed = false;
  } else if (event.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

// Rita bollen
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = secondaryColor;
  ctx.fill();
  ctx.closePath();
}

// Rita paddeln
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = secondaryColor;
  ctx.fill();
  ctx.closePath();
}

// Rita brickor
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = secondaryColor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Kolla kollision med brickor
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (
          x > brick.x &&
          x < brick.x + brickWidth &&
          y > brick.y &&
          y < brick.y + brickHeight
        ) {
          dy = -dy; // Byt riktning
          brick.status = 0; // Ta bort brickan
          score++;
          if (score >= 30)
          {
            gameEnd = true;
            gamePaused = true;
          }
            
        }
      }
    }
  }
}

function drawMultilineText(text, x, y, lineHeight) {
    const lines = text.split("\n"); // Dela upp texten vid '\n'
    ctx.textAlign = "center";
    ctx.font = "18px monospace";
    ctx.fillStyle = secondaryColor;

    lines.forEach((line, index) => {
        ctx.fillText(line, x, y + (index * lineHeight));
    });
}

// Rita UI
function drawUI(){
    canvas.style.backgroundColor = primaryColor;

    ctx.font = "18px monospace";
    ctx.fillStyle = secondaryColor;
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 8, 20); // Placerar texten längst upp till vänster
    ctx.fillText("High Score: " + highScoreBreakout, 8+ctx.measureText("Score: " + score).width+8, 20);
    ctx.textAlign = "right";
    ctx.fillText("Press P to "+ pString, canvas.width-8, 20); 

    let endMessage = "";

    if (gameEnd)
    {
        ctx.textAlign = "center";

        if (score < 30)
            endMessage = "Game over!";
        else if (score >= 30)
            endMessage = "You won!";

        if (score > highScoreBreakout)
        {
            highScoreBreakout = score;
            localStorage.setItem("highScoreBreakout", highScoreBreakout);
        }
            
        if (rPressed)
        {
          document.location.reload();
        }
          
        drawMultilineText(endMessage + "\n Score: "+ score + "\n Press R to play again", canvas.width/2, canvas.height/2, 25);
    }
}


function resetGame(){
  score = 0;
  highScoreBreakout = 0; 
  localStorage.setItem("highScoreBreakout", highScoreBreakout);

  if (pString == "pause")
    document.location.reload();
}

// Uppdatera canvas och hantera rörelse
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Rensa canvas
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawUI();

  // Flytta bollen
  if (!gamePaused)
  {
    x += dx;
    y += dy;
  }

  // Kontrollera bollens kollision med kanterna
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy; // Studsa mot taket
  } else if (y + dy > canvas.height - (ballRadius+paddleHeight)) {

    // Kontrollera om bollen träffar paddeln
    if ((x > paddleX && x < paddleX + paddleWidth)) {
      dy = -dy; // Studsa tillbaka
    } else {
      if (y + dy > canvas.height - ballRadius)
      {
        // Spelet är slut om bollen missar paddeln
        gamePaused = true;
        gameEnd = true;
      }
    }
  }

  // Flytta paddeln
  if (!gamePaused)
  {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
      }
      if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
      }
  }


  requestAnimationFrame(update);
}

// Starta spelet
update();


/*
ok lista
- poängssystem*
- game over screen, starta nytt spel*
- färger som passar hemsidan* / bilder
- pausa spelet, starta spelet, avsluta spelet*
- fixa så att bollen studsar precis mot paddeln och inte mot kanten*
- fixa något med att bollen studsar på samma sätt hela tiden*
- bakgrund med nån tavla 
- flera levlar, nya "bricks" typ som kanske har sönder fler bricks under, bollen går snabbare, fler bricks. lägg in lite randomness
*/