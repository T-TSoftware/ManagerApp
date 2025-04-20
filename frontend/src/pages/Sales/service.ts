import { API_BASE_URL } from "../../config/api";
import { SalesRows } from "./sales.types";

export const getAllSales = async (companyId: string): Promise<SalesRows[]> => {
  const res = await fetch(`${API_BASE_URL}`, {
    headers: {
      Authorization: `Bearer ${companyId}`,
      "Content Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Fetch Error");
  return res.json();
};