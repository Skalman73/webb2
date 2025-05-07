const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Bilens position och storlek
const carHeight = 75;
const carWidth = 50;
let carX = (canvas.width - carWidth) / 2;
let carY = canvas.height - carHeight - 35;
const carSpeed = 5;

// Hinder
const obstacleHeight = 50;
const obstacleWidth = 50;
let obstacleAmount = 3;
let obstacleX = 0;
let obstacleY = 0;
let obstacleSpeed = 3.5;
let obstacles = [];

const pointRadius = 10;
let pointAmount = 1;
let pointX = 0;
let pointY = 0;
let pointSpeed = 3.5;
let points = [];

// Tangenttryck
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

let rPressed = false;

// Gameloop
let gamePaused = true;
let gameEnd = false;
let pString = "play";
let score = 0;
let recentScore = 0;
let highScoreCar = localStorage.getItem("highScoreCar") || 0;
let level = 1;

// Initiera hinder
function initiateObstacles(){
  for (let i = 0; i < obstacleAmount; i++) {
    obstacles[i] = { x: 0, y: 0, status: 1, exited: false}; // status = 1 innebär att hindret finns. exited betyder att det har lämnat canvasen
    let obstacleX = Math.random()*canvas.width;
    obstacles[i].x = obstacleX;
    let obstacleY = (Math.random()*(-canvas.height*2))-obstacleHeight;
    obstacles[i].y = obstacleY;
  }
}
initiateObstacles();

function initiatePoints(){
  for (let i = 0; i < pointAmount; i++) {
    points[i] = { x: 0, y: 0, status: 1, exited: false}; // status = 1 innebär att poängen finns. exited betyder att det har lämnat canvasen
    let pointX = Math.random()*canvas.width;
    points[i].x = pointX;
    let pointY = (Math.random()*(-canvas.height*2))-pointRadius;
    points[i].y = pointY;
  }
}
initiatePoints();




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
  } else if (event.key === 'ArrowUp') {
    upPressed = true;
  } else if (event.key === 'ArrowDown') {
    downPressed = true;
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
  } else if (event.key === 'ArrowUp') {
    upPressed = false;
  } else if (event.key === 'ArrowDown') {
    downPressed = false;
  }
}

// Rita bilen
function drawCar() {
  ctx.beginPath();
  ctx.rect(carX, carY, carWidth, carHeight);
  ctx.fillStyle = secondaryColor;
  ctx.fill();
  ctx.closePath();
}

// Rita hinder
function drawObstacles() {
   for (let i = 0; i < obstacleAmount; i++) {
    if (obstacles[i].status === 1) {
      ctx.beginPath();
      ctx.rect(obstacles[i].x, obstacles[i].y, obstacleWidth, obstacleHeight);
      ctx.fillStyle = secondaryColor;
      ctx.fill();
      ctx.closePath();
    }
  }
}

// Rita poäng
function drawPoints() {
  for (let i = 0; i < pointAmount; i++) {
   if (points[i].status === 1) {
     ctx.beginPath();
     ctx.arc(points[i].x, points[i].y, pointRadius, 0, Math.PI * 2);
     ctx.fillStyle = secondaryColor;
     ctx.fill();
     ctx.closePath();
   }
 }
}


// Kollision
function collisionDetection() {
for (let i = 0; i < obstacleAmount; i++) {
    const obstacle = obstacles[i];

    if (obstacle.status === 1) {
      if (
        carX < obstacle.x + obstacleWidth &&
        carX+carWidth > obstacle.x &&
        carY+carHeight > obstacle.y &&
        carY < obstacle.y + obstacleHeight
      ) {
          gameEnd = true;
          gamePaused = true;
      }
    }
  }

  for (let i = 0; i < pointAmount; i++) {
    const point = points[i];

    if (point.status === 1) {
      if (
        carX < point.x + pointRadius*2 &&
        carX+carWidth > point.x &&
        carY+carHeight > point.y &&
        carY < point.y + pointRadius*2
      ) {
          point.status = 0; // Ta bort poängen
          score += 10;
      }
    }
  }
}

function levelControl()
{
  if (score == recentScore+50)
  {
    level++;

    obstacleSpeed += 0.5;
    pointSpeed += 0.5;

    recentScore = score;
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

  // Black background with purple outline for the upper UI
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, 30);
  ctx.strokeStyle = secondaryColor;
  ctx.stroke();
  ctx.fillStyle = primaryColor;
  ctx.fill();
  ctx.closePath();

  // Black background with purple outline for lower UI
  ctx.beginPath();
  ctx.rect(0, canvas.height-30, canvas.width, 30);
  ctx.strokeStyle = secondaryColor;
  ctx.stroke();
  ctx.fillStyle = primaryColor;
  ctx.fill();
  ctx.closePath();

  ctx.closePath();

  ctx.font = "18px monospace";
  ctx.fillStyle = secondaryColor;
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 8, 20); // Placerar texten längst upp till vänster
  ctx.fillText("High Score: " + highScoreCar, 8+ctx.measureText("Score: " + score).width+8, 20);
  ctx.textAlign = "right";
  ctx.fillText("Press P to "+ pString, canvas.width-8, 20); 
  ctx.textAlign = "center";
  ctx.fillText("Level: "+ level, canvas.width/2, canvas.height-10); 

  let endMessage = "";

  if (gameEnd)
  {
    
    // // Black background for game over screen
    ctx.beginPath();
    ctx.rect((canvas.width/2)-100, (canvas.height/2)-100, 200, 200);
    ctx.fillStyle = primaryColor;
    ctx.fill();
    ctx.closePath();

      ctx.textAlign = "center";

      if (score < 30)
          endMessage = "Game over!";
      else if (score >= 30)
          endMessage = "You won!";

      if (score > highScoreCar)
      {
          highScoreCar = score;
          localStorage.setItem("highScoreCar", highScoreCar);
          console.log("new highscore")
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
highScoreCar = 0; 
localStorage.setItem("highScoreCar", highScoreCar);

if (pString == "pause")
  document.location.reload();
}


// Uppdatera canvas och hantera rörelse
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Rensa canvas
    
    
    if ((!gamePaused) && (!gameEnd))
    {
      for (let i = 0; i < obstacleAmount; i++) {
        obstacles[i].y += obstacleSpeed;
  
        if (obstacles[i].y > canvas.height+obstacleHeight)
        {
          obstacles[i].exited = true;
        }
      }
  
      if (obstacles.every(obstacles => obstacles.exited))
      {
        obstacleAmount = 3 + Math.floor(level/2);
        initiateObstacles();
      }
  
      for (let i = 0; i < pointAmount; i++) {
        points[i].y += pointSpeed;
        if (points[i].y > canvas.height+pointRadius)
          {
            points[i].exited = true;
          }
      }
  
      if (points.every(points => points.exited))
      {
        initiatePoints();
      }
  
    }
    

    drawCar();
    drawObstacles();
    drawPoints();
    
    drawUI();
    collisionDetection();
    levelControl();

  // Flytta bilen
  if ((!gamePaused) && (!gameEnd))
    {
        if (rightPressed && carX < canvas.width - carWidth) {
          carX += carSpeed;
        }
        if (leftPressed && carX > 0) {
            carX -= carSpeed;
        }

        if (upPressed && carY > 30) {
            carY -= carSpeed;
          }
        if (downPressed && carY < canvas.height - carHeight - 30) {
            carY += carSpeed;
        }

    }

    requestAnimationFrame(update);
}

update();

// Undvik att låta användaren styra skrollningen med piltangenterna
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);