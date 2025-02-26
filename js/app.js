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
const initSpeed = 400; 

const gameBoard = document.getElementById("gameboard");
const gameMessage = document.getElementById("gameMessage");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const snakeHead = document.getElementById("snakeHead")
const food = document.getElementById("food");

let gameState = initState();
let moveInterval;
 


function createBoard() {
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

// board should be cleared until start button is pressed
function initState() {
    gameBoard.innerHTML = "";
    gameMessage.innerText = "Please press start button to start the game!";
    return {
        level: null, // default
        snakePosition: null, 
        foodPosition: null, 
        snakeDirection: null
    };
    
};


function startGame() {
    gameState.snakePosition = [
        {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize)
        }],
        gameState.snakeDirection = getRandomDirection();
    gameState.foodPosition = [
        {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize)
        }
    ];
    gameState.level = 1;
    addSnake();
    addFood();
    startBtn.toggleAttribute('disabled');
    document.addEventListener("keydown", moveSnake);
    clearInterval(moveInterval);
    moveInterval = setInterval(updateGame, initSpeed);
    gameMessage.innerText = `Current Level: ${gameState.level}`;
}


function addSnake() {
    const sqrs = document.querySelectorAll(".sqr");
    sqrs.forEach(sqr => sqr.innerHTML = "");
    // const { x, y } = gameState.snakePosition[0];
    // const idx = x + y * boardSize;
    // sqrs[idx].appendChild(snakeHead);
    for (let i = 0; i < gameState.snakePosition.length; i++) {
        const snakePart = gameState.snakePosition[i]; // access each snake segment
        const idx = snakePart.x + snakePart.y * boardSize;
        if (sqrs[idx]) {
            const snakePart = snakeHead.cloneNode(true);
            sqrs[idx].appendChild(snakePart);
        }
        addFood();
    }

}

function addFood() {

    const sqrs = document.querySelectorAll(".sqr");
    const { x, y } = gameState.foodPosition[0];
    const idx = x + y * boardSize;
    sqrs[idx].appendChild(food);
}

function removeFood() {
    const sqrs = document.querySelectorAll(".sqr");
    const { x, y } = gameState.foodPosition[0];
    const idx = x + y * boardSize;


    const newHead = gameState.snakePosition[0];
    // check if new head is in same location as food
    if (newHead.x === x && newHead.y === y) {
        // then move food to new random location
        gameState.foodPosition[0] = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize)
        };
    }
}


function moveSnake(event) {
    if (event.key === "ArrowUp") {
        gameState.snakeDirection = "up";
    } else if (event.key === "ArrowDown") {
        gameState.snakeDirection = "down";
    } else if (event.key === "ArrowLeft") {
        gameState.snakeDirection = "left";
    } else if (event.key === "ArrowRight") {
        gameState.snakeDirection = "right";
    }
}


function reset() {
    gameBoard.innerHTML = "";
    createBoard();
    startBtn.removeAttribute('disabled');
    clearInterval(moveInterval);
    document.addEventListener("keydown", moveSnake);
    gameMessage.innerText = "Please press start button to start the game!";
}

function updateGame() {
    let newHead = { ...gameState.snakePosition[0] };

    if (gameState.snakeDirection === "up") {
        newHead.y = newHead.y - 1;
    } else if (gameState.snakeDirection === "down") {
        newHead.y = newHead.y + 1;
    } else if (gameState.snakeDirection === "left") {
        newHead.x = newHead.x - 1;
    } else if (gameState.snakeDirection === "right") {
        newHead.x = newHead.x + 1;
    }

    // check wall collision
    if (newHead.x < 0 || newHead.x >= boardSize || newHead.y < 0 || newHead.y >= boardSize) {
        return gameOver();
    }

    // check self collision
    // start from i = 1 because 0 is the snake's head
    for (let i = 1; i < gameState.snakePosition.length; i++) {
        const snakePart = gameState.snakePosition[i];
        if (snakePart.x === newHead.x && snakePart.y === newHead.y) {
            return gameOver();
        }
    }

    // Update snake position
    gameState.snakePosition.unshift(newHead);

    // make food respawn when eaten
    if (newHead.x === gameState.foodPosition[0].x && newHead.y === gameState.foodPosition[0].y) {
        gameState.level += 1;
        clearInterval(moveInterval);
        moveInterval = setInterval(updateGame, initSpeed - 20);
        gameMessage.innerText = `Current Level: ${gameState.level}`;
        removeFood();
        addFood();
    } else {
        gameState.snakePosition.pop();
    }

    // render snake
    addSnake();

};


function gameWon() {
    gameMessage.innerText = "Congrats! You've won!";
    clearInterval(moveInterval);
    startBtn.removeAttribute('disabled');
}

function gameOver() {
    gameMessage.innerText = "Game over!"
    clearInterval(moveInterval);
    startBtn.removeAttribute('disabled');
    document.removeEventListener("keydown", moveSnake);
}


document.addEventListener("DOMContentLoaded", createBoard);
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", reset);
document.addEventListener("keydown", moveSnake)