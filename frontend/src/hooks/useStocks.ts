import { useEffect, useState } from "react";
import { getAllStocks } from "../pages/AdminStock/service"; 
import { getToken } from "../utils/token";
import type { StockRows } from "../pages/AdminStock/types"; 

export const useStocks = () => {
  const [stocks, setStocks] = useState<StockRows[]>([]);
  const [loading, setLoading] = useState(true);
  const token = getToken();

  useEffect(() => {
    if (!token) return;
    getAllStocks(token)
      .then(setStocks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stockOptions = stocks.map((stock) => ({
    code: stock.code, 
    name: stock.name,
    
  }));

  return { stocks, stockOptions, loading };
};
