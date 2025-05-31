import axios from "../../utils/axios"; 
import { CostSummaryRows } from "./types";

export const getAllCostSummaries = async (
  token: string,
  projectId: string
): Promise<CostSummaryRows[]> => {
  const res = await axios.get(`projects/${projectId}/costsummary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
