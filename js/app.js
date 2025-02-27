/*-------------- Constants -------------*/
const boardSize = 10; // 10 x 10 grid
const initSpeed = 400;
const eatFoodMeow = new Audio("https://github.com/tsztin0217/snake-game/raw/refs/heads/main/assets/audio/eat-food.mp3");
const gameOverMeow = new Audio("https://github.com/tsztin0217/snake-game/raw/refs/heads/main/assets/audio/game-over-meow.mp3");

/*----- Cached Element References  -----*/
const gameBoard = document.getElementById("gameboard");
const gameMessage = document.getElementById("gameMessage");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const muteBtn = document.getElementById("sound");
const snakeHead = document.getElementById("snakeHead")
const food = document.getElementById("food");

/*---------- Variables (state) ---------*/
let startMessage = "1. Press the Start button or the Enter key to begin! \
                    \n2. Use arrow key to move the snake! \
                    \n 3. Avoid the edges and don't run into yourself or it's game over! Good luck!";

let gameState = initState();
let moveInterval;

/*-------------- Functions -------------*/
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
    gameMessage.innerText = startMessage;
    return {
        level: null,
        snakePosition: null,
        foodPosition: null,
        snakeDirection: null
    };

};

function startGame() {
    gameState.snakePosition = [
        { // avoiding edges for possibility of auto fail
            x: Math.floor(Math.random() * (boardSize - 2)) + 1, // avoid index 0 and 9
            y: Math.floor(Math.random() * (boardSize - 2)) + 1
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
    gameMessage.style.textAlign = "center";
    gameMessage.innerText = `Current Level: ${gameState.level}`;
}

function levelUp() {
    gameState.level += 1;
    clearInterval(moveInterval);
    moveInterval = setInterval(updateGame, initSpeed - 20 * gameState.level);
    gameMessage.style.textAlign = "center";
    gameMessage.innerText = `Current Level: ${gameState.level}`;
}


function addSnake() {
    const sqrs = document.querySelectorAll(".sqr");
    sqrs.forEach(sqr => sqr.innerHTML = "");

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
    gameMessage.innerText = startMessage;
    startBtn.textContent = "Play";
    document.removeEventListener("keydown", moveSnake);
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

    // Create an array of snake parts
    const snakeParts = [];
    for (let i = 0; i < gameState.snakePosition.length; i++) {
        snakeParts.push(gameState.snakePosition[i]);
    }


    // Check self-collision
    for (let i = 1; i < snakeParts.length; i++) {
        if (snakeParts[i].x === newHead.x && snakeParts[i].y === newHead.y) {
            return gameOver();
        }
    }

    // winning condition
    if (gameState.level === 20) {
        gameWon();
    }

    // Update snake position during movement
    gameState.snakePosition.unshift(newHead);

    // make food respawn when eaten
    if (newHead.x === gameState.foodPosition[0].x && newHead.y === gameState.foodPosition[0].y) {
        levelUp();
        removeFood();
        addFood();
        eatFoodMeow.play();
    } else {
        gameState.snakePosition.pop();
    }

    // render snake
    addSnake();
};


function gameWon() {
    gameMessage.style.textAlign = "center";
    gameMessage.innerText = `AMAZING! You've reached level ${gameState.level} and ate all the food! \nYou're the winner!!`;
    clearInterval(moveInterval);
    startBtn.removeAttribute('disabled');
    startBtn.textContent = "Play Again";
}

function gameOver() {
    gameMessage.style.textAlign = "center";
    gameMessage.innerText = `Game over! You've reached ${gameState.level} level(s)! \nYou did great!`
    clearInterval(moveInterval);
    startBtn.removeAttribute('disabled');
    document.removeEventListener("keydown", moveSnake);
    gameOverMeow.play();
}


document.addEventListener("DOMContentLoaded", createBoard);
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", reset);
muteBtn.addEventListener("click", () => {
    if (muteBtn.innerText === 'Mute') {
        eatFoodMeow.muted = true;
        gameOverMeow.muted = true;
        muteBtn.innerText = 'Unmute';
    } else {
        eatFoodMeow.muted = false;
        gameOverMeow.muted = false;
        muteBtn.innerText = 'Mute';
    }
})

/*----------- Event Listeners ----------*/
document.addEventListener("keydown", moveSnake)
window.addEventListener("keydown", (event) => { // disable up-down key causing scrolling
    if (["ArrowUp", "ArrowDown"].indexOf(event.code) > -1) {
        event.preventDefault();
    }
}, false);

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { // allowing enter key to start game
        startGame();             // for improving accessibility
    }
})
