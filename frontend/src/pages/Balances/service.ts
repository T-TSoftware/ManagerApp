import { API_BASE_URL } from "../../config/api";
import { BalanceRows } from "./types";

export const getAllBalance = async (token: string): Promise<BalanceRows[]> => {
  const res = await fetch(`${API_BASE_URL}balances`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Fetch Error");
  return res.json();
};

export const addBalances = async (
  token: string,
  data: Omit<BalanceRows, "isNew">[]
) => {
  console.log("data:", JSON.stringify(data));
  const res = await fetch(`${API_BASE_URL}balances`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Add Error");
  return res.json();
};

export const updateBalances = async (token: string, data: BalanceRows[]) => {
  const res = await fetch(`${API_BASE_URL}balances`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Update Error");
  return res.json();
};

export const deleteBalances = async (token: string, ids: string[]) => {
  const res = await fetch(`${API_BASE_URL}balances`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error("Delete Error");
  return res.json();
};
