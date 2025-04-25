import { API_BASE_URL } from "../../config/api";
import { StockRows } from "./stock.types";

export const getAllStocks = async (
  token: string,
  projectId: string
): Promise<StockRows[]> => {
  const res = await fetch(
    `${API_BASE_URL}projects/${projectId}/subcontractor`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content type": "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Fetch Error");
  return res.json();
};
