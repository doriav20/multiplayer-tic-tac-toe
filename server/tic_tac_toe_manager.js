const numberOfRows = parseInt(process.env.TIC_TAC_TOE_ROWS) || 3;
const numberOfColumns = parseInt(process.env.TIC_TAC_TOE_COLUMNS) || 3;

const generateEmptyBoard = () => Array.from({ length: numberOfRows }, () => Array(numberOfColumns).fill(null));

const checkRowsWin = (board) => {
    for (const row of board) {
        if (row.every((cell) => cell === 'X') || row.every((cell) => cell === 'O')) {
            return row[0];
        }
    }
    return null;
};

const checkColumnsWin = (board) => {
    for (let i = 0; i < numberOfColumns; i++) {
        const firstCell = board[0][i];
        if (firstCell === null) {
            continue;
        }
        for (let j = 1; j < numberOfRows; j++) {
            if (board[j][i] !== firstCell) {
                break;
            }
            if (j === numberOfRows - 1) {
                return firstCell;
            }
        }
    }
    return null;
};

const checkTopLeftToBottomRightDiagonalWin = (board) => {
    if (numberOfRows !== numberOfColumns) {
        return null;
    }

    const firstCell = board[0][0];
    if (firstCell === null) {
        return null;
    }
    for (let i = 1; i < numberOfRows; i++) {
        if (board[i][i] !== firstCell) {
            return null;
        }
    }
    return firstCell;
};
const checkBottomLeftToTopRightDiagonalWin = (board) => {
    if (numberOfRows !== numberOfColumns) {
        return null;
    }

    const firstCell = board[numberOfRows - 1][0];
    if (firstCell === null) {
        return null;
    }
    for (let i = 1; i < numberOfRows; i++) {
        if (board[numberOfRows - 1 - i][i] !== firstCell) {
            return null;
        }
    }
    return firstCell;
};

const checkDraw = (board) => {
    return board.every((row) => row.every((cell) => cell !== null));
};

const checkFinished = (board) => {
    const winner =
        checkRowsWin(board) ||
        checkColumnsWin(board) ||
        checkTopLeftToBottomRightDiagonalWin(board) ||
        checkBottomLeftToTopRightDiagonalWin(board);

    if (winner) {
        return winner;
    }
    if (checkDraw(board)) {
        return 'DRAW';
    }
    return null;
};

module.exports = { generateEmptyBoard, checkFinished, numberOfRows, numberOfColumns };
