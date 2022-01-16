import { useClientId, useSocket } from "./hooks";
import { ChangeEvent, useState } from "react";
import "./App.css";
import { GameTile } from "./components/GameTile";
import { GameGrid } from "./components/GameGrid";

function App() {
  const [gameToJoin, setGameToJoin] = useState<string>("");

  const clientId = useClientId();
  const { createGame, joinGame, makeMove, gameId, board } = useSocket(clientId);

  const handleGameToJoinChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGameToJoin(e.target.value);
  };

  const handleJoinGame = () => {
    joinGame(gameToJoin);
  };

  const simulateClickTile = () => {
    makeMove({
      row: 0,
      column: 0,
    });
  };

  const handleTileClick = (row: number, column: number) => {
    // call makeMove
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
          <GameGrid rows={board.length} columns={board[0].length}>
            {renderTiles()}
          </GameGrid>
        )}
        <button onClick={createGame}>Create Game</button>
        <p>{gameId}</p>
        <br />

        <input value={gameToJoin} onChange={handleGameToJoinChange} />
        <button onClick={handleJoinGame}>Join Game</button>

        <br />
        <button onClick={simulateClickTile}>Make Move</button>
      </header>
    </div>
  );
}

export default App;
