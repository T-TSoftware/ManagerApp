import { useEffect, useState } from "react";
import { CurrentRows } from "./current.types";
import { getAllCurrent } from "./service";
import { useApp } from "../../hooks/useApp";

export const useCurrent = () => {
  const {companyId} = useApp();

  const [currents, setCurrents] = useState<CurrentRows[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!companyId) return;
    getAllCurrent(companyId)
      .then(setCurrents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { currents, loading };
};
