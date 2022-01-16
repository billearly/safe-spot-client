import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { GameBoard, Tile, TilePosition } from "../types";

const URL = "http://localhost:3001";
const socket = io(URL, { autoConnect: false });

type GameCreatedPayload = {
  gameId: string;
};

type GameStartedPayload = {
  board: GameBoard;
};

type MoveMadePayload = {
  board: GameBoard;
};

type SocketData = {
  createGame: () => void;
  joinGame: (gameId?: string) => void;
  makeMove: (tile: TilePosition) => void;
  gameId?: string;
  board?: GameBoard; // Should this be the entire game?
};

// THis should be named something like 'useGame' since the underlying implementation could change
// I mean I probably won't change this to polling, but who knows
export const useSocket = (clientId?: string): SocketData => {
  // TODO: gameId is a little confusing because this is only relevant when a game is created by this client
  // Should I also set this when a game is joined?
  const [gameId, setGameId] = useState<string>();
  const [board, setBoard] = useState<GameBoard>();

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

    socket.on("gameStarted", (payload: GameStartedPayload) => {
      // console.log(payload.board);
      setBoard(payload.board);
    });

    socket.on("moveMade", (payload: MoveMadePayload) => {
      // console.log(payload.board);
      setBoard(payload.board);
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

  const makeMove = (tilePosition: TilePosition) => {
    socket.emit("makeMove", {
      gameId,
      userId: clientId,
      tile: tilePosition,
    });
  };

  return {
    createGame,
    joinGame,
    makeMove,
    gameId,
    board,
  };
};
