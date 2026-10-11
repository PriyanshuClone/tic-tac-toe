import {
    PLAYER,
    COMPUTER,
    getAvailableMoves,
    getWinner
} from "./game.js";


function randomMove(board) {

    const moves = getAvailableMoves(board);

    if (moves.length === 0) {
        return null;
    }

    return moves[Math.floor(Math.random() * moves.length)];

}


function findWinningMove(board, symbol) {

    for (const index of getAvailableMoves(board)) {

        board[index] = symbol;

        const winner = getWinner(board);

        board[index] = "";

        if (winner === symbol) {
            return index;
        }

    }

    return null;

}


function mediumMove(board) {

    // Win if the computer has an immediate winning move.
    const winningMove = findWinningMove(board, COMPUTER);

    if (winningMove !== null) {
        return winningMove;
    }

    // Otherwise, block the player's immediate winning move.
    const blockingMove = findWinningMove(board, PLAYER);

    if (blockingMove !== null) {
        return blockingMove;
    }

    // No immediate win or threat: choose randomly.
    return randomMove(board);

}


function minimax(board, depth, isMaximizing) {

    const winner = getWinner(board);

    if (winner === COMPUTER) {
        return 10 - depth;
    }

    if (winner === PLAYER) {
        return depth - 10;
    }

    const moves = getAvailableMoves(board);

    if (moves.length === 0) {
        return 0;
    }


    if (isMaximizing) {

        let bestScore = -Infinity;

        for (const index of moves) {

            board[index] = COMPUTER;

            const score = minimax(board, depth + 1, false);

            board[index] = "";

            bestScore = Math.max(bestScore, score);

        }

        return bestScore;

    }


    let bestScore = Infinity;

    for (const index of moves) {

        board[index] = PLAYER;

        const score = minimax(board, depth + 1, true);

        board[index] = "";

        bestScore = Math.min(bestScore, score);

    }

    return bestScore;

}


function hardMove(board) {

    let bestScore = -Infinity;
    let bestMoves = [];

    for (const index of getAvailableMoves(board)) {

        board[index] = COMPUTER;

        const score = minimax(board, 0, false);

        board[index] = "";

        if (score > bestScore) {

            bestScore = score;
            bestMoves = [index];

        } else if (score === bestScore) {

            bestMoves.push(index);

        }

    }

    if (bestMoves.length === 0) {
        return null;
    }

    // Randomize equally good moves to make play less predictable.
    return bestMoves[
        Math.floor(Math.random() * bestMoves.length)
    ];

}


export function getComputerMove(board, difficulty = "easy") {

    switch (difficulty) {

        case "medium":
            return mediumMove(board);

        case "hard":
            return hardMove(board);

        case "easy":
        default:
            return randomMove(board);

    }

}