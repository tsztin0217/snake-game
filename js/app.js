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

const gameBoard = document.getElementById('gameboard');
const startBtn = document.getElementById('start')
const reset = document.getElementById('reset')

const boardSize = 10;

function initState() {
    return {level: 1, // default
    snakePosition: [], // math.floor, math random
    foodPosition: null, // math.floor, math random
    snakeDirection: null
}
};

function startGame() {
    gameState = initState();

    gameState.snakePosition = [{x: Math.floor(Math.random()*boardSize), y: Math.floor(Math.random()*boardSize)}]
}

function updateGame() {

}

function gameWon() {

}

function gameOver() {
    
}



document.addEventListener('DOMContentLoaded', initState);
startBtn.addEventListener('click', startGame);