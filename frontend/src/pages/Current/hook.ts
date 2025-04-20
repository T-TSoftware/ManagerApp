import { useEffect, useState } from "react";
import { CurrentRows } from "./current.types";
import { getAllCurrent } from "./service";

export const useCurrent = () => {
  const [currents, setCurrents] = useState<CurrentRows[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCurrent()
    .then(setCurrents)
    .catch(console.error)
    .finally(() => setLoading(false))
  }, []);

  return { currents, loading };
};
