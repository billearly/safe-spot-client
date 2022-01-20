import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ClientInfo } from "../types";

const ID_PRIVATE_KEY = "id-private";
const ID_PUBLIC_KEY = "id-public";

export const useClientInfo = (): ClientInfo | undefined => {
  const [clientInfo, setClientInfo] = useState<ClientInfo>();

  useEffect(() => {
    if (typeof Storage !== undefined) {
      let privateId = localStorage.getItem(ID_PRIVATE_KEY);
      let publicId = localStorage.getItem(ID_PUBLIC_KEY);

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
      });
    }
  }, []);

  return clientInfo;
};
