const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Bilens position och storlek
const carHeight = 75;
const carWidth = 50;
let carX = (canvas.width - carWidth) / 2;
let carY = canvas.height - carHeight - 5;
const carSpeed = 5;

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



// Uppdatera canvas och hantera rörelse
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Rensa canvas
    drawCar();


 
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
        console.log(carX);
        console.log(carY);
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