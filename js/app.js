import {
    PLAYER,
    COMPUTER,
    createBoard,
    getGameResult
} from "./game.js";

import {
    getComputerMove
} from "./computer.js";


const welcomeScreen = document.getElementById("welcomeScreen");
const gameScreen = document.getElementById("gameScreen");

const startGameBtn = document.getElementById("startGameBtn");
const homeBtn = document.getElementById("homeBtn");

const gameBoard = document.getElementById("gameBoard");
const cells = [...document.querySelectorAll(".cell")];

const gameStatus = document.getElementById("gameStatus");
const gameMessage = document.getElementById("gameMessage");
const turnIndicator = document.getElementById("turnIndicator");

const difficultySelect = document.getElementById("difficultySelect");

const playerScoreElement = document.getElementById("playerScore");
const computerScoreElement = document.getElementById("computerScore");
const drawScoreElement = document.getElementById("drawScore");

const resultPanel = document.getElementById("resultPanel");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");

const playAgainBtn = document.getElementById("playAgainBtn");
const restartRoundBtn = document.getElementById("restartRoundBtn");


let board = createBoard();

let currentPlayer = PLAYER;

let gameActive = false;
let computerThinking = false;

let roundId = 0;

let scores = {
    player: 0,
    computer: 0,
    draws: 0
};


/* =========================================
   START GAME
========================================= */

function startGame() {

    roundId++;

    welcomeScreen.hidden = true;
    gameScreen.hidden = false;

    startRound();

}


/* =========================================
   START OR RESTART A ROUND
========================================= */

function startRound() {

    roundId++;

    board = createBoard();

    currentPlayer = PLAYER;

    gameActive = true;
    computerThinking = false;

    resultPanel.hidden = true;
    restartRoundBtn.hidden = false;

    cells.forEach((cell, index) => {

        cell.textContent = "";

        cell.disabled = false;

        cell.classList.remove(
            "cell-x",
            "cell-o",
            "winning-cell"
        );

        cell.setAttribute(
            "aria-label",
            `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}, empty`
        );

    });

    gameBoard.setAttribute("aria-label", "Tic-Tac-Toe game board");

    updateTurnStatus();

}


/* =========================================
   PLAYER MOVE
========================================= */

function handlePlayerMove(event) {

    const cell = event.target.closest(".cell");

    if (!cell || !gameBoard.contains(cell)) {
        return;
    }

    if (!gameActive || computerThinking) {
        return;
    }

    const index = Number(cell.dataset.index);

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= board.length
    ) {
        return;
    }

    if (board[index] !== "") {
        return;
    }

    if (currentPlayer !== PLAYER) {
        return;
    }


    // Save the player's move.
    board[index] = PLAYER;

    renderCell(index);

    const result = getGameResult(board);

    if (result.status !== "playing") {
        finishGame(result);
        return;
    }


    // It is now the computer's turn.
    currentPlayer = COMPUTER;
    computerThinking = true;

    updateTurnStatus();

    setBoardDisabled(true);

    const currentRound = roundId;

    window.setTimeout(() => {

        // Ignore a scheduled move if the round was restarted.
        if (currentRound !== roundId || !gameActive) {
            return;
        }

        makeComputerMove();

    }, 500);

}


/* =========================================
   COMPUTER MOVE
========================================= */

function makeComputerMove() {

    if (!gameActive) {
        return;
    }

    const difficulty = difficultySelect.value;

    const index = getComputerMove(board, difficulty);

    if (index === null || index === undefined) {

        computerThinking = false;

        finishGame(getGameResult(board));

        return;

    }

    if (board[index] !== "") {

        computerThinking = false;

        return;

    }


    board[index] = COMPUTER;

    renderCell(index);

    computerThinking = false;

    const result = getGameResult(board);

    if (result.status !== "playing") {
        finishGame(result);
        return;
    }

    currentPlayer = PLAYER;

    setBoardDisabled(false);

    updateTurnStatus();

}


/* =========================================
   RENDER A CELL
========================================= */

function renderCell(index) {

    const cell = cells[index];

    const symbol = board[index];

    cell.textContent = symbol;

    cell.classList.toggle("cell-x", symbol === PLAYER);

    cell.classList.toggle("cell-o", symbol === COMPUTER);

    cell.disabled = true;

    const row = Math.floor(index / 3) + 1;
    const column = (index % 3) + 1;

    cell.setAttribute(
        "aria-label",
        `Row ${row}, column ${column}, ${symbol}`
    );

}


/* =========================================
   BOARD INTERACTION
========================================= */

function setBoardDisabled(disabled) {

    cells.forEach((cell, index) => {

        cell.disabled = disabled || board[index] !== "";

    });

}


/* =========================================
   TURN STATUS
========================================= */

function updateTurnStatus() {

    if (!gameActive) {
        return;
    }

    turnIndicator.textContent = currentPlayer;

    turnIndicator.classList.toggle(
        "symbol-x",
        currentPlayer === PLAYER
    );

    turnIndicator.classList.toggle(
        "symbol-o",
        currentPlayer === COMPUTER
    );


    if (computerThinking) {

        gameStatus.textContent = "Computer is thinking...";

        gameMessage.textContent = "Choosing its next move.";

        return;

    }


    if (currentPlayer === PLAYER) {

        gameStatus.textContent = "Your turn!";

        gameMessage.textContent = "Choose an empty square to play.";

    } else {

        gameStatus.textContent = "Computer's turn";

        gameMessage.textContent = "Please wait for the computer.";

    }

}


/* =========================================
   FINISH GAME
========================================= */

function finishGame(result) {

    gameActive = false;
    computerThinking = false;

    setBoardDisabled(true);

    resultPanel.hidden = false;

    restartRoundBtn.hidden = true;


    if (result.status === "win") {

        result.combination?.forEach(index => {

            cells[index].classList.add("winning-cell");

        });

        if (result.winner === PLAYER) {

            scores.player++;

            resultIcon.textContent = "🏆";

            resultTitle.textContent = "You Won!";

            resultMessage.textContent =
                "Amazing! You beat the computer. Ready for another round?";

        } else {

            scores.computer++;

            resultIcon.textContent = "🤖";

            resultTitle.textContent = "Computer Wins!";

            resultMessage.textContent =
                "The computer outplayed you this time. Try again!";

        }

    } else if (result.status === "draw") {

        scores.draws++;

        resultIcon.textContent = "🤝";

        resultTitle.textContent = "It's a Draw!";

        resultMessage.textContent =
            "Both sides played well. Give it another try!";

    } else {

        // Defensive fallback for unexpected calls.
        return;

    }


    updateScoreboard();

    turnIndicator.textContent = "✓";

    gameStatus.textContent = "Round finished";

    gameMessage.textContent = "See the result below.";

}


/* =========================================
   UPDATE SCOREBOARD
========================================= */

function updateScoreboard() {

    playerScoreElement.textContent = scores.player;

    computerScoreElement.textContent = scores.computer;

    drawScoreElement.textContent = scores.draws;

}


/* =========================================
   RETURN TO HOME
========================================= */

function goHome() {

    roundId++;

    gameActive = false;
    computerThinking = false;

    gameScreen.hidden = true;
    welcomeScreen.hidden = false;

    board = createBoard();

}


/* =========================================
   EVENT LISTENERS
========================================= */

// Start only when the user clicks Start Game.
startGameBtn.addEventListener("click", startGame);


// Event delegation: one listener handles all nine cells.
gameBoard.addEventListener("click", handlePlayerMove);


// Start another round after the result.
playAgainBtn.addEventListener("click", startRound);


// Restart the current round.
restartRoundBtn.addEventListener("click", startRound);


// Return to the welcome screen.
homeBtn.addEventListener("click", goHome);


// The module initializes the welcome screen only.
// No round starts automatically when the page loads.
welcomeScreen.hidden = false;

gameScreen.hidden = true;

resultPanel.hidden = true;

restartRoundBtn.hidden = false;

updateScoreboard();