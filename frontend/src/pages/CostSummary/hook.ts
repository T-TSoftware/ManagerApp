import { useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";
import { getAllCostSummaries } from "./service";
import { getToken } from "../../utils/token";
import { CostSummaryRows } from "./costSum.types";

export const useCostSummaries = () => {
  const { projectId } = useParams();
  const token = getToken();
  const [costSummaries, setCostSummaries] = useState<CostSummaryRows[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !token) return;
    getAllCostSummaries(token, projectId)
      .then(setCostSummaries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { costSummaries, loading };
};
