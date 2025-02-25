// Resources:
// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
// https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout

// Rough draft:

// eventlistener for loading page
// eventlistener for clicking start button
// eventlistener for clicking reset button
// eventlistener for pressing arrow keys to change snake direction
// message for win / loss

// Initial state:
// Upon loading the page, 
// has blank game board made up using grid that is made of divs
// start button enabled,
// reset button (there but disabled)

// IF click start button
// THEN Create snake (snake appears)
// random starting point for snake head
// random starting point for snake food
// snake food should NOT be in the same location as snake nor snake's rest of the body
// random direction for snake to move towards
// snake moves in the random direction
// updateGame() that continuously moves the snake in that direction
// disable start button attribute

// updateGame()
// check if the snake head position matches the food position to ensure it's been eaten
// IF food is eaten then remove food element AND add to the snake's length
// ELSE snake keeps moving
// gameWon()
// gameOver()


// gameWon()
// 6 levels - if successfully ate food x times = won...might make it 6 levels
// innertext - "You've won! Play again?"
// startbutton innertext change to play again
// startbutton enabled


// gameOver()
// snake head hits edge of gameboard
// OR snake hits part of itself
// innertext - "Game over! Play again?"
// startbutton innertext change to play again
// start button enabled


// bonus if have extra time left...
// how to make the snake goes faster each time it ate food
// replace snake head with cat head image
// text displaying current level

// initial data structure

const boardSize = 10; // 10 x 10 grid


const gameBoard = document.getElementById("gameboard");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const snakeHead = document.createElement("img");
snakeHead.src = "Pngtree_cat_head.png";
snakeHead.classList.add("snake-head");

let gameState = initState();



function createBoard() {
    console.log("Creating board");
    for (let i = 0; i < 100; i++) { // creating 100 squares
        const sqr = document.createElement("div");
        sqr.classList.add("sqr");
        gameBoard.appendChild(sqr); // make it appear on page
    }
}

function getRandomDirection() {
    const directions = ["up", "down", "left", "right"];
    return directions[Math.floor(Math.random() * directions.length)];
}

function initState() {
    gameBoard.innerHTML = "";
    return {
        level: 1, // default
        snakeHeadPosition: [], // math.floor, math random
        foodPosition: null, // math.floor, math random
        snakeDirection:null
    };
};


function startGame() {
    gameState.snakeHeadPosition = [
        {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize)
        }],
        gameState.snakeDirection = getRandomDirection();
    addSnake();
    startBtn.toggleAttribute('disabled');
    moveInterval = setInterval(updateGame, 10);
}

function addSnake() {
    const sqrs = document.querySelectorAll(".sqr")
    const { x, y } = gameState.snakeHeadPosition[0];
    const idx = x + y * boardSize;
    sqrs[idx].appendChild(snakeHead);
}


function moveSnake(event) {
    if (event.key === "ArrowUp") {
        snakeDirection = "up";
    } else if (event.key === "ArrowDown") {
        snakeDirection = "down";
    } else if (event.key === "ArrowLeft") {
        snakeDirection = "left";
    } else if (event.key === "ArrowRight") {
        snakeDirection = "right";
    }
}

function reset() {
    gameBoard.innerHTML = "";
    createBoard();
    startBtn.removeAttribute('disabled');
    clearInterval(moveInterval);
}

function updateGame() {
    const {x, y} = gameState.snakeHeadPosition[0];

    let newHead = {...gameState.snakeHeadPosition[0]};

    if (gameState.snakeDirection === "up") {
        newHead.y = (gameState.snakeHeadPosition[0].y - 1);
    } else if (gameState.snakeHeadPosition === "down") {
        newHead.y = (gameState.snakeHeadPosition[0].y + 1);
    } else if (gameState.snakeHeadPosition === "left") {
        newHead.x = (gameState.snakeHeadPosition[0].x - 1);
    } else if (gameState.snakeHeadPosition === "right") {
        newHead.x = (gameState.snakeHeadPosition[0].x + 1);
    }
    gameState.snakeHeadPosition.unshift(newHead);
}

// // function gameWon() {

// // }

// // function gameOver() {

// // }



document.addEventListener("DOMContentLoaded", createBoard);
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", reset);
document.addEventListener("keydown", moveSnake);