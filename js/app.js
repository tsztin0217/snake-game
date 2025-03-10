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
const snakeHead = document.getElementById("snakeHead");
const startMessage = document.getElementById("startMessage");
const originalStartMessage = startMessage.innerHTML;
const food = document.getElementById("food");

/*---------- Variables (state) ---------*/
let gameState = initState();
let moveInterval;
let atttemptsCount = 0;
let maxLevel = 1;

/*-------------- Functions -------------*/
function createBoard() {
    for (let i = 0; i < 100; i++) { // creating 100 squares
        const sqr = document.createElement("div");
        sqr.classList.add("sqr"); // so can grab them later using selectAll
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
    return {
        level: null,
        snakePosition: null,
        foodPosition: null,
        snakeDirection: null
    };

};


function startGame() {
    startMessage.innerHTML = ""; // instructions gone
    atttemptsCount += 1;
    gameState.snakePosition = [
        { // avoiding edges for possibility of auto fail
            x: Math.floor(Math.random() * (boardSize - 2)) + 1, // avoid index 0 and 9
            y: Math.floor(Math.random() * (boardSize - 2)) + 1
        }];
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
    document.addEventListener("keydown", moveSnake); // previously disabled when press reset
    clearInterval(moveInterval);
    moveInterval = setInterval(updateGame, initSpeed);
    gameMessage.style.textAlign = "center"; // start message was initially text-aligned to left for better visibility
    gameMessage.innerHTML = `Total Attempts: ${atttemptsCount}<br>Current Level: ${gameState.level}<br>Highest Level Reached: ${maxLevel}`;
}

function levelUp() {
    gameState.level += 1;
    if (gameState.level > maxLevel) {
        maxLevel += 1;
    }
    clearInterval(moveInterval);
    moveInterval = setInterval(updateGame, initSpeed - 20 * gameState.level);
    gameMessage.style.textAlign = "center";
    gameMessage.innerHTML = `Total Attempts: ${atttemptsCount}<br>Current Level: ${gameState.level}<br>Max Level Reached: ${maxLevel}`;
}

function addSnake() {
    const sqrs = document.querySelectorAll(".sqr");
    sqrs.forEach(sqr => sqr.innerHTML = ""); // clears board first before readding new snake and food location

    for (let i = 0; i < gameState.snakePosition.length; i++) {
        const snakePart = gameState.snakePosition[i]; // finds the current snake coordinates 
        const idx = snakePart.x + snakePart.y * boardSize; // collapse coordinates into indexes for grid
        //  from left to right visualization:
        //  {0, 0} = (0 + 0 * 10) = 0    {1, 0} = [1 + 0 * 10] = 1 ... {9, 0} = (9 + 0 * 10) = 9
        //  {0, 1} = (0 + 1 * 10) = 10   {1, 1} = (1 + 1 * 10) = 11 ...{9, 1} = (9 + 1 * 10) = 19
        //  etc
        if (sqrs[idx]) { // if that index contains a number = contains snake
            const snakePart = snakeHead.cloneNode(true); // create  new DOM element for growing instead of rereferencing old one
            sqrs[idx].appendChild(snakePart); // adds the element to corresponding square and make it appear on page
        }
        addFood(); // re adds food
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
        // then move food to new random location to avoid autofail/glitches
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
    startMessage.innerHTML = originalStartMessage;
    gameMessage.innerHTML = "";
    createBoard();
    startBtn.removeAttribute('disabled');
    clearInterval(moveInterval);
    startBtn.textContent = "Play";
    document.removeEventListener("keydown", moveSnake);
    atttemptsCount = 0;
    maxLevel = 1;
}

function updateGame() {
    if (gameState.level > maxLevel) {
        maxLevel = gameState.level;
    }
    let newHead = { ...gameState.snakePosition[0] }; // made a copy of the original head

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

    // winning condition is reaching level 20
    if (gameState.level === 20) {
        gameWon();
    }

    // Update snake position during movement
    gameState.snakePosition.unshift(newHead);

    // make food respawn when eaten
    if (newHead.x === gameState.foodPosition[0].x && newHead.y === gameState.foodPosition[0].y) {
        levelUp();
        eatFoodMeow.play();
        removeFood(); // remove eaten food

        // generate new food that is NOT inside the snake
        let newFoodPosition;
        do {
            newFoodPosition = {
                x: Math.floor(Math.random() * boardSize),
                y: Math.floor(Math.random() * boardSize)
            };
        } while (gameState.snakePosition.some(part => part.x === newFoodPosition.x && part.y === newFoodPosition.y));

        gameState.foodPosition[0] = newFoodPosition; //  new food position
        addFood(); // render new food
    } else {
        gameState.snakePosition.pop(); // remove tail for movement
    }

    // render snake
    addSnake();
};

function gameWon() {
    gameMessage.style.textAlign = "center";
    gameMessage.innerHTML = `AMAZING! You've reached level ${gameState.level} using ${atttemptsCount} attempt(s) and ate all the food! <br>You're the winner!!`;
    clearInterval(moveInterval);
    startBtn.removeAttribute('disabled');
    startBtn.textContent = "Play Again";
}

function gameOver() {
    gameMessage.style.textAlign = "center";
    gameMessage.innerHTML = `Game over!<br>You've reached ${gameState.level} level(s)! <br>Total Attempts: ${atttemptsCount}<br>Highest Level Reached: ${maxLevel}`
    clearInterval(moveInterval);
    startBtn.removeAttribute('disabled');
    startBtn.textContent = "Play Again";
    document.removeEventListener("keydown", moveSnake);
    gameOverMeow.play();
}

/*----------- Event Listeners ----------*/
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