import { useEffect, useState } from "react";
import { getTrafficData } from "../services/api";

export default function useTrafficData() {
  const [total, setTotal] = useState(0);
  const [series, setSeries] = useState([]);

  const load = async () => {
    try {
      const res = await getTrafficData();
      setTotal(res.data.totalRequests || 0);
      setSeries(res.data.timeSeries || []);
    } catch {}
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 1000);
    return () => clearInterval(id);
  }, []);

  return { total, series };
}
