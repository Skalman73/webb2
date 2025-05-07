const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Bilens position och storlek
const carHeight = 75;
const carWidth = 50;
let carX = (canvas.width - carWidth) / 2;
let carY = canvas.height - carHeight - 5;
const carSpeed = 5;

// Hinder
const obstacleHeight = 50;
const obstacleWidth = 50;
let obstacleAmount = 3;
let obstacleX = canvas.width/2;
let obstacleY = -75;
const obstacleSpeed = 3;
let obstacles = [];



// Initiera hinder
function initiateObstacles(){
  for (let i = 0; i < obstacleAmount; i++) {
    obstacles[i] = { x: 0, y: 0, status: 1, exited: false}; // status = 1 innebär att hindret finns
    let obstacleX = Math.random()*canvas.width;
    obstacles[i].x = obstacleX;
    let obstacleY = Math.random()*-canvas.height;
    obstacles[i].y = obstacleY;
  }
}
initiateObstacles();




// Tangenttryck
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

let rPressed = false;

// Gameloop
let gamePaused = false;
let gameEnd = false;
let pString = "play";


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

// Kolla kollision med brickor
// function collisionDetection() {
//   for (let c = 0; c < brickColumnCount; c++) {
//     for (let r = 0; r < brickRowCount; r++) {
//       const brick = bricks[c][r];
//       if (brick.status === 1) {
//         if (
//           x > brick.x &&
//           x < brick.x + brickWidth &&
//           y > brick.y &&
//           y < brick.y + brickHeight
//         ) {
//           dy = -dy; // Byt riktning
//           brick.status = 0; // Ta bort brickan
//           score++;
//           if (score >= 30)
//           {
//             gameEnd = true;
//             gamePaused = true;
//           }
            
//         }
//       }
//     }
//   }
// }

// Uppdatera canvas och hantera rörelse
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Rensa canvas
    drawCar();
    
    for (let i = 0; i < obstacleAmount; i++) {
      obstacles[i].y += obstacleSpeed;

      if (obstacles[i].y > canvas.height+obstacleHeight)
      {
        obstacles[i].exited = true;
      }
    }

    // for (let i = 0; i < obstacleAmount; i++) {
    //   if (obstacles[]) 
    // }
      
      initiateObstacles();

    drawObstacles();

  // Flytta bilen
  if (!gamePaused)
    {
        if (rightPressed && carX < canvas.width - carWidth) {
          carX += carSpeed;
        }
        if (leftPressed && carX > 0) {
            carX -= carSpeed;
        }

        if (upPressed && carY > 0) {
            carY -= carSpeed;
          }
        if (downPressed && carY < canvas.height - carHeight) {
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