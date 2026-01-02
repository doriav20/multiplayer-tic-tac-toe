import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

export const GameStatus = Object.freeze({
    READY_TO_START: 'READY_TO_START',
    WAITING_FOR_OPPONENT: 'WAITING_FOR_OPPONENT',
    IN_PROGRESS: 'IN_PROGRESS',
});

export const InGameStatus = Object.freeze({
    YOUR_TURN: 'Your turn',
    // eslint-disable-next-line quotes
    OPPONENT_TURN: "Opponent's turn",
    YOU_WON: 'You Won!',
    YOU_LOST: 'You Lost :(',
    DRAW: 'Draw',
    OPPONENT_DISCONNECTED: 'Opponent Disconnected',
});

function useTicTacToe() {
    const [board, setBoard] = useState(null);
    const [numberOfRows, setNumberOfRows] = useState(0);
    const [numberOfColumns, setNumberOfColumns] = useState(0);
    const [opponentName, setOpponentName] = useState('');
    const [player, setPlayer] = useState(null);
    const [gameStatus, setGameStatus] = useState(GameStatus.READY_TO_START);
    const [inGameStatus, setInGameStatus] = useState(null);
    const inGameStatusRef = useRef(inGameStatus);
    const playerRef = useRef(player);

    function sendClickToServer(i, j) {
        socket.emit('cell_click', i, j);
    }

    function handleClick(i, j) {
        if (board[i][j] !== null || inGameStatus !== InGameStatus.YOUR_TURN) {
            return;
        }

        setBoard((prevBoard) => {
            const newBoard = [...prevBoard];
            newBoard[i][j] = player;
            return newBoard;
        });
        sendClickToServer(i, j);
    }

    function startGame() {
        socket.emit('start_game');
        setGameStatus(GameStatus.WAITING_FOR_OPPONENT);
    }

    function handleGameStarted({ player1, player1Name, player2, player2Name, numberOfRows, numberOfColumns }) {
        setGameStatus(GameStatus.IN_PROGRESS);
        setNumberOfRows(numberOfRows);
        setNumberOfColumns(numberOfColumns);

        if (socket.id === player1) {
            setPlayer('X');
            setInGameStatus(InGameStatus.YOUR_TURN);
            setOpponentName(player2Name);
        } else if (socket.id === player2) {
            setPlayer('O');
            setInGameStatus(InGameStatus.OPPONENT_TURN);
            setOpponentName(player1Name);
        } else {
            console.error('Something went wrong');
            return;
        }

        setBoard(Array.from({ length: numberOfRows }, () => Array(numberOfColumns).fill(null)));
    }

    function handleBoardUpdated({ board: newBoard, winner }) {
        setBoard(newBoard);

        if (inGameStatusRef.current === InGameStatus.YOUR_TURN) {
            setInGameStatus(InGameStatus.OPPONENT_TURN);
        } else if (inGameStatusRef.current === InGameStatus.OPPONENT_TURN) {
            setInGameStatus(InGameStatus.YOUR_TURN);
        }

        if (winner) {
            if (winner === playerRef.current) {
                setInGameStatus(InGameStatus.YOU_WON);
            } else if (winner === 'DRAW') {
                setInGameStatus(InGameStatus.DRAW);
            } else {
                setInGameStatus(InGameStatus.YOU_LOST);
            }
            setGameStatus(GameStatus.READY_TO_START);
        }
    }

    function handleOpponentDisconnected() {
        setGameStatus(GameStatus.READY_TO_START);
        setInGameStatus(InGameStatus.OPPONENT_DISCONNECTED);
    }

    useEffect(() => {
        inGameStatusRef.current = inGameStatus;
        playerRef.current = player;
    }, [inGameStatus, player]);

    useEffect(() => {
        socket.on('game_started', handleGameStarted);
        socket.on('board_updated', handleBoardUpdated);
        socket.on('opponent_disconnected', handleOpponentDisconnected);

        return () => {
            socket.off('game_started');
            socket.off('board_updated');
            socket.off('opponent_disconnected');
        };
    }, [socket]);

    return { board, handleClick, numberOfRows, numberOfColumns, startGame, gameStatus, inGameStatus, opponentName};
}

export default useTicTacToe;
