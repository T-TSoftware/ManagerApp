import { API_BASE_URL } from "../../config/api";
import { BalanceRows } from "./types";

export const getAllBalance = async (token: string): Promise<BalanceRows[]> => {
  const res = await fetch(`${API_BASE_URL}balances`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Fetch Error");
  return res.json();
};

export const addBalance = async (
  token: string,
  item: Omit<BalanceRows, "isNew">
) => {
  const res = await fetch(`${API_BASE_URL}balances`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const errMsg = await res.text();
    console.error("Add error →", errMsg);
    throw new Error("Add error");
  }

  return res.json();
};

export const updateBalance = async (token: string, item: BalanceRows) => {
  if (!item.id) return;
  const res = await fetch(
    `${API_BASE_URL}balances/${encodeURIComponent(item.id)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    }
  );
  console.log("result put:", JSON.stringify(item));
  const result = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("Update error →", result || res.statusText);
    throw new Error("Update error");
  }
  if (!res.ok) throw new Error("Update error");
  return result;
};

export const deleteBalance = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete error");
};
