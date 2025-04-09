window.addEventListener('load', ()=> {
    console.log('Ready.');

    const date = new Date();
    const year = date.getFullYear();
  
    const yearElement = document.getElementById("year");
    yearElement.innerText = year;
})

// Create array for the nav links
const navLinks = document.querySelector('nav ul');

// Click on the hamburger button to toggle visibility
document.querySelector('.hamburger').addEventListener('click', (event) => {
    console.log('clicked')

    navLinks.classList.toggle('active');
    event.stopPropagation()
});

// Click anywhere else to disable visibility
document.querySelector('html').addEventListener('click', () => {
    console.log('clicked away')

    navLinks.classList.remove('active');
})

// get the element
// const themeSwitch = document.querySelector('#themeswitch');

// themeSwitch.addEventListener('click', (event) =>{
//     console.log('theme switch');

//     const currentTheme = document.body.classList.contains('dark-theme')
//         ? 'dark'
//         : 'light'
//     const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme)

//     event.stopPropagation()

// if (window.updateColors)
//     {
//         window.updateColors();
//     }
// })

// Get the theme from local storage or set it to the default (light)
// function getTheme () {
//     const theme = localStorage.getItem("theme") || 'light'
//     console.log(`Reading theme from localStorage/default as: ${theme}`)

//     return theme
// }

// function setTheme (theme) {
//     console.log(`Setting theme to: ${theme}`)

//     // Toggle the theme and the theme switching text
//     if (theme == 'light') {
//         themeSwitch.innerText = "Switch to a dark theme"
//         document.body.classList.remove('dark-theme');
        
//     } else {
//         themeSwitch.innerText = "Switch to a light theme"
//         document.body.classList.add('dark-theme');
        
//     }
// }

// // Set the theme to the current theme
// setTheme(getTheme());

// Rock paper scissors game
import Game from './rockpaperscissors.js';
const game = new Game();

const result = document.getElementById("result");

document.getElementById("rock").addEventListener("click", () => handleUserChoice("rock"));
document.getElementById("paper").addEventListener("click", () => handleUserChoice("paper"));
document.getElementById("scissors").addEventListener("click", () => handleUserChoice("scissors"));

document.getElementById("reset").addEventListener("click", () => reset());


function handleUserChoice(userChoice) {
    // Run one round of the game
    game.play(userChoice); 
  
    // Get the results from the game 
    result.textContent = game.getMessage();
    result.textContent += game.getScore();
}  
function reset(){
    game.resetGame();
    // Get the results from the game 
    result.textContent = game.getMessage();
    result.textContent += game.getScore();
}