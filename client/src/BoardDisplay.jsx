import './BoardDisplay.css';
import useTicTacToe, { GameStatus } from './useTicTacToe';
import { useState } from "react";

function BoardDisplay() {
    const { board, handleClick, numberOfColumns, startGame, gameStatus, inGameStatus, opponentName } = useTicTacToe();

    const [playerName, setPlayerName] = useState("");

    if (gameStatus === GameStatus.WAITING_FOR_OPPONENT) {
        return (
            <div>
                <p>Waiting for opponent...</p>
            </div>
        );
    }

    const readyToStart = gameStatus === GameStatus.READY_TO_START;

    const BoardComponent = () => {
        return (
            board &&
            board.map((row, i) => (
                <div className="row" key={i}>
                    {row.map((col, j) => {
                        const index = i * numberOfColumns + j;
                        return (
                            <button className="cell" key={index} onClick={() => handleClick(i, j)}>
                                {board[i][j]}
                            </button>
                        );
                    })}
                </div>
            ))
        );
    };

    return (
        <>
            <div className="game-status">
                <p>{inGameStatus}</p>
            </div>
            <div>
                <BoardComponent />
            </div>
            {opponentName && (
                <div className="game-status">
                    <p>Opponent: {opponentName}</p>
                </div>
            )
            }
            {readyToStart && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                    />
                    <button className="start-game-button" onClick={() => startGame(playerName)}>
                        Start Game
                    </button>
                </div>
            )}
        </>
    );
}

export default BoardDisplay;
