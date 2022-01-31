import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ClientInfo } from "../types";

const ID_PRIVATE_KEY = "id-private";
const ID_PUBLIC_KEY = "id-public";
const ID_SOCKET_KEY = "id-socket";

interface ClientInfoInterface {
  privateId?: string;
  publicId?: string;
  socketId?: string | null;
  setSocketId: (id: string) => void;
}

export const useClientInfo = (isConnected: boolean): ClientInfoInterface => {
  const [clientInfo, setClientInfo] = useState<ClientInfo>();

  const setSocketId = (id: string) => {
    localStorage.setItem(ID_SOCKET_KEY, id);

    setClientInfo((clientInfo) => ({
      ...clientInfo,
      socketId: id,
    }));
  };

  useEffect(() => {
    if (typeof Storage !== undefined) {
      let privateId = localStorage.getItem(ID_PRIVATE_KEY);
      let publicId = localStorage.getItem(ID_PUBLIC_KEY);
      let socketId = localStorage.getItem(ID_SOCKET_KEY);

      if (!privateId) {
        privateId = uuidv4();
        localStorage.setItem(ID_PRIVATE_KEY, privateId);
      }

      if (!publicId) {
        publicId = uuidv4();
        localStorage.setItem(ID_PUBLIC_KEY, publicId);
      }

      setClientInfo({
        privateId,
        publicId,
        socketId,
      });
    }
  }, [isConnected]);

  return {
    ...clientInfo,
    setSocketId,
  };
};
