import { useSocket } from "./hooks";
import { ChangeEvent, useState } from "react";
import "./App.css";
import { GameTile } from "./components/GameTile";
import { GameGrid } from "./components/GameGrid";
import { TurnIndicator } from "./components/TurnIndicator";

function App() {
  const [gameToJoin, setGameToJoin] = useState<string>("");

  const { createGame, joinGame, makeMove, gameId, game, isCurrentTurn } =
    useSocket();

  const { board, status } = game || {};

  const handleGameToJoinChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGameToJoin(e.target.value);
  };

  const handleJoinGame = () => {
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

        <div style={{ display: "flex" }}>
          {gameId && <p>Game: {gameId}</p>}
          {status && <p style={{ paddingLeft: "20px" }}>Status: {status}</p>}
        </div>
        <br />

        {!game && (
          <>
            <button onClick={createGame}>Create Game</button>
            <p>{gameId}</p>
            <br />

            <input value={gameToJoin} onChange={handleGameToJoinChange} />
            <button onClick={handleJoinGame}>Join Game</button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
