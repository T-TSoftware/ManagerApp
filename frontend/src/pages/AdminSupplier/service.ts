/* import type { SupplierListRows } from "./types";
import { API_BASE_URL } from "../../config/api";

export const getAllSuppliers = async (token: string): Promise<SupplierListRows[]> => {
  const res = await fetch(`${API_BASE_URL}projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};

export const getSupplierById = async (
  token: string,
  id: string
): Promise<SupplierListRows> => {
  console.log("a:");
  const res = await fetch(`${API_BASE_URL}projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch project");
  return res.json();
};

export const createSupplier = async (
  token: string,
  data: Partial<SupplierListRows>
): Promise<SupplierListRows> => {
  const res = await fetch(`${API_BASE_URL}projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
};

export const updateSupplier = async (
  token: string,
  data: Partial<SupplierListRows>
): Promise<SupplierListRows> => {
  const res = await fetch(`${API_BASE_URL}projects/${data.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update project");
  return res.json();
};

export const deleteSupplier = async (token: string, id: string) => {
  const res = await fetch(`${API_BASE_URL}projects/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete project");
};
 */