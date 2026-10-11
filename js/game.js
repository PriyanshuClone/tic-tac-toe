export const PLAYER = "X";
export const COMPUTER = "O";

export const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];


export function createBoard() {
    return Array(9).fill("");
}


export function getWinningCombination(board) {

    for (const combination of WINNING_COMBINATIONS) {

        const [a, b, c] = combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
            return combination;
        }

    }

    return null;
}


export function getWinner(board) {

    const combination = getWinningCombination(board);

    if (!combination) {
        return null;
    }

    return board[combination[0]];
}


export function getGameResult(board) {

    const winner = getWinner(board);

    if (winner) {
        return {
            status: "win",
            winner,
            combination: getWinningCombination(board)
        };
    }

    if (board.every(cell => cell !== "")) {
        return {
            status: "draw",
            winner: null,
            combination: null
        };
    }

    return {
        status: "playing",
        winner: null,
        combination: null
    };
}


export function getAvailableMoves(board) {

    return board
        .map((cell, index) => cell === "" ? index : null)
        .filter(index => index !== null);

}