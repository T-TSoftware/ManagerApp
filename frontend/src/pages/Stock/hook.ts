import { useEffect, useState } from "react";
import { StockRows } from "./stock.types";
import { getAllStocks } from "./service"
import { useApp } from "../../hooks/useApp";

export const useStock = () => {
  const { companyId } = useApp();
  const [stocks, setStocks] = useState<StockRows[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!companyId) return;
    getAllStocks(companyId)
    .then(setStocks)
    .catch(console.error)
    .finally(()=>setLoading(false))
  }, []);

  return { stocks, loading };
};
