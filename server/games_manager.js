const { generateEmptyBoard, checkFinished } = require('./tic_tac_toe_manager');
const games = {};
const playersInGame = {};
let nextGameId = 0;
let pendingGameId = null;

const initGame = () => {
    const gameId = nextGameId;
    games[gameId] = {
        board: generateEmptyBoard(),
        player1: null,
        player2: null,
        turn: 1,
        inProgress: false,
    };
    nextGameId++;
    return gameId;
};

const assignSocketToGame = (gameId, socketId) => {
    const game = games[gameId];
    if (!game.player1) {
        game.player1 = socketId;
        playersInGame[socketId] = gameId;
    } else if (!game.player2) {
        game.player2 = socketId;
        playersInGame[socketId] = gameId;
    } else {
        console.error('Game is full');
    }
};

const startGame = (socket) => {
    const socketId = socket.id;
    const prevGameId = playersInGame[socketId];

    if (games[prevGameId]?.inProgress) {
        console.error(`${socketId} is already in a game`);
        return {};
    }

    let gameId;
    let readyToStart;
    if (pendingGameId === null) {
        gameId = initGame();
        pendingGameId = gameId;
        readyToStart = false;
        console.log(`${socketId} is waiting for another player to join game ${gameId}`);
    } else {
        gameId = pendingGameId;
        pendingGameId = null;
        readyToStart = true;
        games[gameId].inProgress = true;
        console.log(`${socketId} joined game ${gameId}, ready to start`);
    }

    assignSocketToGame(gameId, socketId);
    const { player1, player2 } = games[gameId];
    return { gameId, readyToStart, player1, player2 };
};

const getBoard = (socket) => {
    const socketId = socket.id;
    const gameId = playersInGame[socketId];
    const game = games[gameId];
    if (!game) {
        console.error(`${socketId} is not in a game or game ${gameId} does not exist`);
        return null;
    }
    return game.board;
};

const validateMove = (socket, i, j) => {
    const socketId = socket.id;
    const gameId = playersInGame[socketId];
    if (gameId === undefined || !(gameId in games)) {
        console.error(`${socketId} is not in a game or game ${gameId} does not exist`);
        return false;
    }
    if (!games[gameId].inProgress) {
        console.error(`Game ${gameId} is not in progress`);
        return false;
    }

    const board = games[gameId].board;
    if (board[i][j] !== null) {
        console.error(`Cell ${i},${j} is already occupied`);
        return false;
    }

    if (
        (games[gameId].player1 === socketId && games[gameId].turn === 2) ||
        (games[gameId].player2 === socketId && games[gameId].turn === 1)
    ) {
        console.error(`${socketId} is not allowed to move`);
        return false;
    }

    return true;
};

const updateBoard = (socket, i, j) => {
    const valid = validateMove(socket, i, j);
    if (!valid) return { boardUpdated: false, winner: null };
    const socketId = socket.id;
    const gameId = playersInGame[socketId];
    games[gameId].board[i][j] = games[gameId].turn === 1 ? 'X' : 'O';

    let winner = checkFinished(games[gameId].board);

    if (winner) {
        console.log(`Game ${gameId} finished`);
        games[gameId].inProgress = false;
    }

    games[gameId].turn = games[gameId].turn === 1 ? 2 : 1;

    return { boardUpdated: true, winner };
};

const isInGame = (socket) => {
    const socketId = socket.id;
    return socketId in playersInGame;
};

const disconnectFromGame = (socket) => {
    const socketId = socket.id;
    const gameId = playersInGame[socketId];
    delete playersInGame[socketId];
    games[gameId].inProgress = false;
    console.log(`${socketId} disconnected from game ${gameId}`);
    return gameId;
};

const getGameId = (socket) => {
    const socketId = socket.id;
    return playersInGame[socketId];
};

module.exports = { startGame, getBoard, isInGame, disconnectFromGame, updateBoard, getGameId };
