export default class Game {
    // List of available choices in the game
    choices=["rock", "paper", "scissors"];

    // User's current score
    userScore = 0;
    // Computer's current score
    computerScore = 0;
    // The current message to display
    currentMessage = "";


    // Constructor is used to initialize properties
    constructor(){

    }

    play(userChoice){
        let score = "";
        let computerChoice = this.#getComputerChoice();

        if (userChoice == computerChoice)
        {
            score = "draw";
            
        } else {
            
            if ((userChoice == "paper") && (computerChoice == "rock"))
            {
                score = "win";
            } else if ((userChoice == "scissors") && (computerChoice == "paper"))
            {
                score = "win";
            } else if ((userChoice == "rock") && (computerChoice == "scissors"))
            {
                score = "win";
            } else {
                score = "lose";
            }   
        }
        this.#updateScore(score);
        this.#generateMessage(score, userChoice, computerChoice)
        
    }

    #updateScore(result){
        if (result == "win")
            this.userScore++;
        else if (result == "lose")
            this.computerScore++;
    }

    getScore(){
        return this.userScore;
    }

    getMessage(){
        return this.currentMessage;
    }

    resetGame(){
        this.userScore = 0;
        this.computerScore = 0;
        this.#generateMessage("reset", "", "");
    }

    #getComputerChoice(){
        let rand = Math.floor(Math.random()*this.choices.length);
        console.log(rand);
        return this.choices[rand];
    }

    #getResult(userChoice, computerChoice){

    }

    #generateMessage(result, userChoice, computerChoice){
        let computerString = "";
        let userString = "";

        // switch(computerChoice){
        //     case "rock":
        //     {
        //         computerString = "eraser";
        //         var img = document.getElementById("computer_img");
        //         // img.src="../img/eraser.png";
        //         break;
        //     }
        //     case "scissors":
        //     {
        //         computerString = "pencil";
        //         var img = document.getElementById("computer_img");
        //         // img.src="../img/pencil.png";
        //         break;
        //     }
        //     case "paper":
        //     {
        //         computerString = "paper";
                
        //         var img = document.getElementById("computer_img");
        //         // img.src="../img/sketchbook.webp";
        //         break;
        //     }
            
        // }

        // switch(userChoice){
        //     case "rock":
        //     {
        //         userString = "eraser"
        //         break;
        //     }
        //     case "scissors":
        //     {
        //         userString = "pencil"
        //         break;
        //     }
        //     case "paper":
        //     {
        //         userString = "paper";
        //         break;
        //     }
        // }
        var img = document.getElementById("computer_img");
        
        let message = "The Computer chose " + computerChoice + " and you chose " + userChoice;
        if (result == "win")
            message += "\n. You won!";

        if (result == "lose")
            message += ". You lost!";

        if (result == "draw")
            message += ". It's a draw!";

        if (result == "reset")
        {
            message = "";
        }

        message += " Computer score: " + this.computerScore +  " Your score: ";

        this.currentMessage = message;
    }
}

/*
- gör score tydligare, ha 1 - 0 
- ha en bild när monet "tänker"
- eller bara en tom ruta eller nåt
- visa vilken bild som spelaren har valt
- centrera allt lite mer typ...
*/