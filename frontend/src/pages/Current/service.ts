import { API_BASE_URL } from "../../config/api";
import { CurrentRows } from "./current.types";

export const getAllCurrent = async (companyId: string): Promise<CurrentRows[]> => {
  const res = await fetch(`${API_BASE_URL}`, {
    headers: {
      Authorization: `Bearer ${companyId}`,
      "Content Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Fetch error");
  return res.json();
};
