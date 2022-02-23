import { useSocket } from "./hooks";
import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import { GameTile } from "./components/GameTile";
import { GameGrid } from "./components/GameGrid";
import { TurnIndicator } from "./components/TurnIndicator";
import { Status } from "./components/Status";
import { Spinner } from "./components/Spinner";

function App() {
  const [gameToJoin, setGameToJoin] = useState<string>("");

  const {
    createGame,
    joinGame,
    makeMove,
    gameId,
    game,
    isCurrentTurn,
    status: socketStatus,
  } = useSocket();

  const { board, status } = game || {};

  // This could be cleaner if there were explicit components for creating and
  // joining games. Heck even have explicit pages
  const [isGameCreator, setIsGameCreator] = useState(false);
  const [waitingForCreation, setIsWaitingForCreation] = useState(false);
  const [isJoiningGame, setIsJoiningGame] = useState(false);

  const handleCreateGame = () => {
    setIsGameCreator(true);
    setIsWaitingForCreation(true);
    createGame();
  };

  useEffect(() => {
    if (gameId) {
      setIsWaitingForCreation(false);
    }
  }, [gameId]);

  useEffect(() => {
    if (game) {
      setIsJoiningGame(false);
    }
  }, [game]);

  const handleGameToJoinChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGameToJoin(e.target.value);
  };

  const handleJoinGame = () => {
    setIsJoiningGame(true);
    joinGame(gameToJoin);
  };

  const handleTileClick = (row: number, column: number) => {
    makeMove({
      row,
      column,
    });
  };

  // Figure out why the return type on this isn't liked if its not any
  const renderTiles = (): any[] => {
    let tiles: JSX.Element[] = [];

    if (!board) {
      return tiles;
    }

    for (var row = 0; row < board.length; row++) {
      for (var column = 0; column < board[row].length; column++) {
        tiles.push(
          <GameTile
            key={`${row}-${column}`}
            row={row}
            column={column}
            isRevealed={board[row][column].isRevealed}
            isSafe={board[row][column].isSafe}
            displayNum={board[row][column].displayNum}
            handleClick={handleTileClick}
          />
        );
      }
    }

    return tiles;
  };

  return (
    <div className="App">
      <header className="App-header">
        {board && (
          <>
            <GameGrid rows={board.length} columns={board[0].length}>
              {renderTiles()}
            </GameGrid>

            <TurnIndicator isCurrentTurn={isCurrentTurn} />
          </>
        )}

        {!game && (
          <>
            <button onClick={handleCreateGame}>Create Game</button>

            {waitingForCreation && (
              <>
                <p>Creating game...</p>
                <Spinner />
              </>
            )}

            {gameId && isGameCreator && (
              <>
                <p>Send this game ID to your partner: {gameId}</p>

                <p>Waiting for partner to join</p>
                <Spinner />
              </>
            )}
            <br />

            <input
              value={gameToJoin}
              onChange={handleGameToJoinChange}
              placeholder="Enter Game ID to join"
            />
            <button onClick={handleJoinGame}>Join Game</button>

            {isJoiningGame && (
              <>
                <p>Joining game...</p>
                <Spinner />
              </>
            )}
          </>
        )}

        <Status
          websocketStatus={socketStatus}
          gameId={gameId}
          gameStatus={status}
        />
      </header>
    </div>
  );
}

export default App;
