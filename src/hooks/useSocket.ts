import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const URL = "http://localhost:3001";
const socket = io(URL, { autoConnect: false });

type GameCreatedPayload = {
  gameId: string;
};

type SocketData = {
  createGame: () => void;
  joinGame: (gameId?: string) => void;
  gameId?: string;
};

export const useSocket = (clientId?: string): SocketData => {
  const [gameId, setGameId] = useState<string>();

  useEffect(() => {
    socket.connect();

    socket.on("connected", (message: String) => {
      console.log(message);
    });

    socket.on("gameCreated", (payload: GameCreatedPayload) => {
      setGameId(payload.gameId);
    });

    socket.on("gameJoined", (payload: string) => {
      console.log(payload);
    });
  }, []);

  const createGame = () => {
    socket.emit("createGame", {
      creator: clientId,
    });
  };

  const joinGame = (gameId?: string) => {
    socket.emit("joinGame", {
      gameId,
      userId: clientId,
    });
  };

  return {
    createGame,
    joinGame,
    gameId,
  };
};
