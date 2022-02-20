export enum GameStatus {
  WAITING_FOR_PLAYER = "WAITING_FOR_PLAYER",
  IN_PROGRESS = "IN_PROGRESS",
  WON = "WON",
  LOST = "LOST",
}

export type Tile = {
  row: number;
  column: number;
  isSafe?: boolean;
  isRevealed: boolean;
  displayNum?: number;
};

// This should be Position and Tile should have this as a property
export type TilePosition = Pick<Tile, "row" | "column">;

export type Game = {
  id: string;
  board: GameBoard;
  status: GameStatus;
  currentTurn: string;
};

export type GameBoard = Tile[][];

export type ClientInfo = {
  privateId?: string;
  publicId?: string;
  socketId?: string | null;
};

export enum ServerAction {
  GIVE_SOCKET_INFO = "giveSocketInfo",
  GAME_CREATED = "gameCreated",
  GAME_STARTED = "gameStarted",
  MOVE_MADE = "moveMade",
}

export enum ClientAction {
  CREATE_GAME = "createGame",
  GET_SOCKET_INFO = "getSocketInfo",
  JOIN_GAME = "joinGame",
  MAKE_MOVE = "makeMove",
}

// Server messages
export type ServerPayload = {
  action: ServerAction;
};

export type ConnectedPayload = ServerPayload & {
  data: {
    socketId: string;
  };
};

export type GameCreatedPayload = ServerPayload & {
  data: {
    gameId: string;
  };
};

export type GameStartedPayload = ServerPayload & {
  data: {
    game: Game;
  };
};

export type MoveMadePayload = ServerPayload & {
  data: {
    game: Game;
  };
};

// Client messages
export type ClientPayload = {
  action: ClientAction;
};

export type CreateGamePayload = {
  data: {
    client: ClientInfo;
  };
} & ClientPayload;

export type JoinGamePayload = ClientPayload & {
  data: {
    gameId: string;
    client: ClientInfo;
  };
};

export type MakeMovePayload = ClientPayload & {
  data: {
    gameId: string;
    client: ClientInfo;
    tile: TilePosition;
  };
};
