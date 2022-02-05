import { useEffect, useMemo, useState } from "react";
import { useClientInfo } from ".";
import {
  ClientAction,
  ClientPayload,
  ConnectedPayload,
  CreateGamePayload,
  Game,
  GameCreatedPayload,
  GameStartedPayload,
  JoinGamePayload,
  MakeMovePayload,
  MoveMadePayload,
  ServerAction,
  ServerPayload,
  TilePosition,
} from "../types";

const URL = "ws://localhost:3001";

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
export const useSocket = (): SocketData => {
  const [socket] = useState<WebSocket>(new WebSocket(URL)); // Consider making a connection a manual process
  const [gameId, setGameId] = useState<string>();
  const [game, setGame] = useState<Game>();

  const clientInfo = useClientInfo(!!socket);
  const { setSocketId } = clientInfo;

  const isCurrentTurn = useMemo(() => {
    console.log(game?.currentTurn, "current turn");
    console.log(clientInfo?.publicId, "my public id");

    return game?.currentTurn === clientInfo?.publicId;
  }, [game, clientInfo]);

  useEffect(() => {
    if (!socket) {
      throw new Error("No socket instance");
    }

    socket.addEventListener("open", () => {
      const getSocketInfoPayload: ClientPayload = {
        action: ClientAction.GET_SOCKET_INFO,
      };

      socket.send(JSON.stringify(getSocketInfoPayload));
    });

    socket.addEventListener("message", (event) => {
      const payload: ServerPayload = JSON.parse(event.data);

      switch (payload.action) {
        case ServerAction.GIVE_SOCKET_INFO:
          const connectedPayload = payload as ConnectedPayload;
          setSocketId(connectedPayload.data.socketId);
          break;

        case ServerAction.GAME_CREATED:
          const gameCreatedPayload = payload as GameCreatedPayload;
          setGameId(gameCreatedPayload.data.gameId);
          break;

        case ServerAction.GAME_STARTED:
          console.log("game started");
          const gameStartedPayload = payload as GameStartedPayload;
          setGame(gameStartedPayload.data.game);
          break;

        case ServerAction.MOVE_MADE:
          const moveMadePayload = payload as MoveMadePayload;
          setGame(moveMadePayload.data.game);
          break;

        default:
          throw new Error(`${payload.action} is not a valid action`);
        // TODO: Handle this
      }
    });
  }, []);

  const createGame = () => {
    if (!socket) {
      throw new Error("No socket instance");
    }

    if (!clientInfo) {
      throw new Error("No client info");
    }

    // Need to send the object shape that API Gateway is expecting
    const payload: CreateGamePayload = {
      action: ClientAction.CREATE_GAME,
      data: {
        client: clientInfo,
      },
    };

    socket.send(JSON.stringify(payload));
  };

  const joinGame = (gameId?: string) => {
    if (!socket) {
      throw new Error("No socket instance");
    }

    if (!clientInfo) {
      throw new Error("No client info");
    }

    if (!gameId) {
      throw new Error("No game id");
    }

    const payload: JoinGamePayload = {
      action: ClientAction.JOIN_GAME,
      data: {
        gameId,
        client: clientInfo,
      },
    };

    socket.send(JSON.stringify(payload));

    setGameId(gameId);
  };

  const makeMove = (tilePosition: TilePosition) => {
    if (!gameId) {
      throw new Error("No game id");
    }

    const payload: MakeMovePayload = {
      action: ClientAction.MAKE_MOVE,
      data: {
        gameId,
        client: clientInfo,
        tile: tilePosition,
      },
    };

    socket.send(JSON.stringify(payload));
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
