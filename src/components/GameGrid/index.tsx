import React, { CSSProperties } from "react";
import "./GameGrid.scss";

type GameGridProps = {
  rows: number;
  columns: number;
  children: Node[];
};

export const GameGrid = ({ children, rows, columns }: GameGridProps) => {
  const styles = {
    "--rows": rows,
    "--columns": columns,
  } as CSSProperties;

  return (
    <div className="tile-grid" style={styles}>
      {children}
    </div>
  );
};
