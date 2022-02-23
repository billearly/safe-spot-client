import React, { useEffect, useState } from "react";
import classnames from "classnames";
import "./GameTile.scss";
import { Spinner } from "../Spinner";

type GameTileProps = {
  row: number;
  column: number;
  isRevealed: boolean;
  isSafe?: boolean;
  displayNum?: number;
  handleClick: (row: number, column: number) => void;
};

export const GameTile = ({
  row,
  column,
  isRevealed,
  isSafe,
  displayNum,
  handleClick,
}: GameTileProps) => {
  const [isSuspect, setIsSuspect] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const classes = classnames("game-tile", {
    "game-tile--unclicked": !isRevealed && !isSuspect,
    "game-tile--clicked": isRevealed,
    "game-tile--suspect": !isRevealed && isSuspect,
    "game-tile--bomb": isRevealed && !isSafe,
  });

  useEffect(() => {
    if (isRevealed) {
      setShowSpinner(false);
    }
  }, [isRevealed]);

  const onClick = () => {
    if (!isSuspect) {
      setShowSpinner(true);
      handleClick(row, column);
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSuspect(!isSuspect);
    return false;
  };

  const getText = (): string => {
    if (!isRevealed && isSuspect) {
      return "🚩";
    }

    if (isRevealed && !isSafe) {
      return "💣";
    }

    if (isRevealed) {
      return `${displayNum}`;
    }

    return "";
  };

  return (
    <button
      className={classes}
      onClick={onClick}
      onContextMenu={handleContextMenu}
    >
      <div className="game-tile__accent">
        <span>{getText()}</span>

        {showSpinner && <Spinner />}
      </div>
    </button>
  );
};
