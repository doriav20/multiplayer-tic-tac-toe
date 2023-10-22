const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const {
    startGame,
    isInGame,
    getBoard,
    disconnectFromGame,
    updateBoard,
    getGameId,
    isGameInProgress,
} = require('./games_manager');
const cors = require('cors');
const { numberOfRows, numberOfColumns } = require('./tic_tac_toe_manager');
const port = 3001;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

const gameIdToRoom = (gameId) => `game_${gameId}`;

io.on('connection', (socket) => {
    const socketId = socket.id;

    console.log(`User connected: ${socketId}`);

    if (isInGame(socket)) {
        socket.emit('board_updated', { board: getBoard(socket) });
    }

    socket.on('start_game', () => {
        const { gameId, readyToStart, player1, player2 } = startGame(socket);
        const room = gameIdToRoom(gameId);
        socket.join(room);

        if (readyToStart) {
            console.log(`Game ${gameId} started`);
            io.to(room).emit('game_started', { player1, player2, numberOfRows, numberOfColumns });
        }
    });

    socket.on('cell_click', (i, j) => {
        const room = gameIdToRoom(getGameId(socket));
        const { boardUpdated, winner } = updateBoard(socket, i, j);
        if (boardUpdated) {
            io.to(room).emit('board_updated', { board: getBoard(socket), winner });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socketId}`);
        if (isInGame(socket)) {
            const gameInProgress = isGameInProgress(getGameId(socket));
            const gameId = disconnectFromGame(socket);
            const room = gameIdToRoom(gameId);
            socket.disconnect(true);
            if (gameInProgress) {
                io.to(room).emit('opponent_disconnected');
            }
        }
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
