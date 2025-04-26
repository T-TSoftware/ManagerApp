import { API_BASE_URL } from "../../config/api";
import { CostSummaryRows } from "./costSum.types";

export const getAllCostSummaries = async (
  token: string,
  projectId: string
): Promise<CostSummaryRows[]> => {
  const res = await fetch(`${API_BASE_URL}projects/${projectId}/costsummary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Fetch Error");
  return res.json();
};
