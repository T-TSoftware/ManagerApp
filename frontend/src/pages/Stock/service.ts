import { API_BASE_URL } from "../../config/api";
import { StockRows } from "./stock.types";

export const getAllStocks = async (companyId: string): Promise<StockRows[]> => {
  const res = await fetch(
    `${API_BASE_URL}projects/a085fa43-a0cc-4c7b-86b0-e4f332109ba3/subcontractor`,
    {  headers : {
    Authorization: `Bearer ${companyId}`,
    "Content type": "application/json",
} }
  );
  if (!res.ok) throw new Error("Fetch Error");
  return res.json();
};