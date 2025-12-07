import { useEffect, useState } from "react";
import { getChainStatus } from "../services/api";

export default function useChainStatus() {
  const [chainOK, setChainOK] = useState(true);

  const load = async () => {
    try {
      const res = await getChainStatus();
      setChainOK(!!res.data.valid);
    } catch {
      setChainOK(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return chainOK;
}
