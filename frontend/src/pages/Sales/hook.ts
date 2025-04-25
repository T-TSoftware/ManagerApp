import { useEffect, useState } from "react";
import { SalesRows } from "./sales.types";
import { getAllSales } from "./service";
import { useApp } from "../../hooks/useApp";
import { getToken } from "../../utils/token";

export const useSales = () => {
  const { projectId } = useApp();
  const token = getToken();
  const [sales, setSales] = useState<SalesRows[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !token) return;
    getAllSales(token, projectId)
      .then(setSales)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { sales, loading };
};
