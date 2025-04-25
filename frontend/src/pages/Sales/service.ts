import { API_BASE_URL } from "../../config/api";
import { SalesRows } from "./sales.types";

export const getAllSales = async (
  token: string,
  projectId: string
): Promise<SalesRows[]> => {
  const res = await fetch(`${API_BASE_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Fetch Error");
  return res.json();
};
