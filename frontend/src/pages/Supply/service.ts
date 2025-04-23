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

export const addSupply = async (
  companyId: string,
  item: Omit<SupplyRows, "isNew">
) => {
  const res = await fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Add error");
  return res.json();
};

export const updateSupply = async (companyId: string, item: SupplyRows) => {
  const res = await fetch(`${API_BASE_URL}/${item.code}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Update error");
  return res.json();
};

export const deleteSupply = async (companyId: string, code: string) => {
  const res = await fetch(`${API_BASE_URL}/${code}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete error");
};