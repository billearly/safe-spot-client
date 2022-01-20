import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { ClientInfo, Game, GameBoard, TilePosition } from "../types";

const URL = "http://localhost:3001";
const socket = io(URL, { autoConnect: false });

type GameCreatedPayload = {
  gameId: string;
};

type GameStartedPayload = {
  game: Game;
};

type MoveMadePayload = {
  game: Game;
};

type SocketData = {
  createGame: () => void;
  joinGame: (gameId?: string) => void;
  makeMove: (tile: TilePosition) => void;
  gameId?: string; // This isn't needed because the Game has this property
  game?: Game;
  isCurrentTurn: boolean;
};

// THis should be named something like 'useGame' since the underlying implementation could change
// I mean I probably won't change this to polling, but who knows
export const useSocket = (clientInfo?: ClientInfo): SocketData => {
  // TODO: gameId is a little confusing because this is only relevant when a game is created by this client
  const [gameId, setGameId] = useState<string>();
  const [game, setGame] = useState<Game>();

  const isCurrentTurn = useMemo(() => {
    console.log(game?.currentTurn, "current turn");
    console.log(clientInfo?.publicId, "my public id");

    return game?.currentTurn === clientInfo?.publicId;
  }, [game, clientInfo]);

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
      setGame(payload.game);
    });

    socket.on("moveMade", (payload: MoveMadePayload) => {
      setGame(payload.game);
    });
  }, []);

  const createGame = () => {
    socket.emit("createGame", {
      client: clientInfo,
    });
  };

  const joinGame = (gameId?: string) => {
    socket.emit("joinGame", {
      gameId,
      client: clientInfo,
    });

    // Should this only be set if we get a 'gameJoined' message?
    setGameId(gameId);
  };

  const makeMove = (tilePosition: TilePosition) => {
    socket.emit("makeMove", {
      gameId,
      client: clientInfo,
      tile: tilePosition,
    });
  };

  return {
    createGame,
    joinGame,
    makeMove,
    gameId,
    game,
    isCurrentTurn,
  };
};
