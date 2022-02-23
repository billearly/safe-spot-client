import "./Status.scss";

type StatusProps = {
  websocketStatus: string;
  gameId: string | undefined;
  gameStatus: string | undefined;
};

export const Status = ({
  websocketStatus,
  gameId,
  gameStatus,
}: StatusProps) => {
  return (
    <div className="status">
      <p>WebSocket Status: {websocketStatus}</p>
      <p>Game ID: {gameId}</p>
      <p>Game Status: {gameStatus}</p>
    </div>
  );
};
