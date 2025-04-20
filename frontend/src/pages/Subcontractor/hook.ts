import { useEffect, useState } from "react";
import { SubcontractorRows } from "./subcontractor.types";
import {getAllSubcontractorByProject} from "./service"
import { useApp } from "../../hooks/useApp";


export const useSubcontractor = () => {
  const { companyId } = useApp();
  const [subcontractor, setSubcontractor] = useState<SubcontractorRows[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!companyId) return;
    getAllSubcontractorByProject(companyId)
    .then(setSubcontractor)
    .catch(console.error)
    .finally(() => setLoading(false))
    
    }, []);

  return { subcontractor, loading };
};
