import logo from "./logo.svg";
import "./App.css";
import { useClientId, useSocket } from "./hooks";
import { ChangeEvent, useState } from "react";

function App() {
  const [gameToJoin, setGameToJoin] = useState<string>("");

  const clientId = useClientId();
  const { createGame, joinGame, gameId } = useSocket(clientId);

  const handleGameToJoinChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGameToJoin(e.target.value);
  };

  const handleJoinGame = () => {
    joinGame(gameToJoin);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={createGame}>Create Game</button>
        <p>{gameId}</p>
        <br />

        <input value={gameToJoin} onChange={handleGameToJoinChange} />
        <button onClick={handleJoinGame}>Join Game</button>
      </header>
    </div>
  );
}

export default App;
