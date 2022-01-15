import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const USER_ID_KEY = "user-id";

export const useClientId = (): string | undefined => {
  const [clientId, setClientId] = useState<string>();

  useEffect(() => {
    if (typeof Storage !== undefined) {
      let id = localStorage.getItem(USER_ID_KEY);

      if (!id) {
        id = uuidv4();
        localStorage.setItem(USER_ID_KEY, id);
      }

      setClientId(id);
    }
  }, []);

  return clientId;
};
