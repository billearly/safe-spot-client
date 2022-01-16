export type Tile = {
  row: number;
  column: number;
  isSafe?: boolean;
  isRevealed: boolean;
  displayNum?: number;
};

// This should be Position and Tile should have this as a property
export type TilePosition = Pick<Tile, "row" | "column">;

export type GameBoard = Tile[][];
