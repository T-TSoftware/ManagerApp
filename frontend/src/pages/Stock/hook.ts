import { useEffect, useState } from "react";
import { StockRows } from "./stock.types";
import { getAllStocks } from "./service";
import { useApp } from "../../hooks/useApp";
import { getToken } from "../../utils/token";

export const useStock = () => {
  const { projectId } = useApp();
  const token = getToken();
  const [stocks, setStocks] = useState<StockRows[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !token) return;
    getAllStocks(token,projectId)
      .then(setStocks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { stocks, loading };
};
