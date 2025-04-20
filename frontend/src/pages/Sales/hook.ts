import { useEffect, useState } from "react";
import { SalesRows } from "./sales.types";
import { getAllSales } from "./service"
import { useApp } from "../../hooks/useApp";


export const useSales = () => {
  const { companyId } = useApp();
  const [sales, setSales] = useState<SalesRows[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!companyId) return;
    getAllSales(companyId)
    .then(setSales)
    .catch(console.error)
    .finally(()=> setLoading(false))
  }, []);

  return { sales, loading };
};
