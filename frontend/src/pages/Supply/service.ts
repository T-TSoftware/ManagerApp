import { API_BASE_URL } from "../../config/api";
import { SupplyRows } from "./supply.types";

export const getAllSupplies = async (companyId:string): Promise<SupplyRows[]> => {
  const res = await fetch(
    `${API_BASE_URL}projects/a085fa43-a0cc-4c7b-86b0-e4f332109ba3/suppliers`,
    {
      headers: {
        Authorization: `Bearer ${companyId}`,
        "Content type": "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Fetch Error");
  return res.json();
};
