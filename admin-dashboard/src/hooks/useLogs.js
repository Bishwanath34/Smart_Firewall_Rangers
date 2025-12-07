import { useEffect, useState } from "react";
import { getLogs } from "../services/api";

export default function useLogs() {
  const [logs, setLogs] = useState([]);

  const load = async () => {
    try {
      const res = await getLogs();
      setLogs(res.data || []);
    } catch {}
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 1000);
    return () => clearInterval(id);
  }, []);

  return logs;
}
