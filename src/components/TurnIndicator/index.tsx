import { Spinner } from "../Spinner";
import "./TurnIndicator.scss";

type TurnIndicatorProps = {
  isCurrentTurn: boolean;
};

export const TurnIndicator = ({ isCurrentTurn }: TurnIndicatorProps) => {
  const text = isCurrentTurn ? "your turn" : "partner's turn";

  return (
    <div className="turn-indicator">
      <p>{text.toUpperCase()}</p>

      {!isCurrentTurn && <Spinner />}
    </div>
  );
};
