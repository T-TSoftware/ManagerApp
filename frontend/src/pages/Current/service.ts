import { API_BASE_URL } from "../../config/api";
import { CurrentRows } from "./current.types";

export const getAllCurrents = async (
  projectId: string,
  token: string
): Promise<CurrentRows[]> => {
  const res = await fetch(`${API_BASE_URL}projects/${projectId}/currents`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Fetch Error");
  return res.json();
};

export const addCurrent = async (
  token: string,
  projectId: string,
  item: Omit<CurrentRows, "isNew">
) => {
  const res = await fetch(`${API_BASE_URL}projects/${projectId}/currents`, {
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

export const updateCurrent = async (
  token: string,
  projectId: string,
  item: CurrentRows
) => {
  const res = await fetch(
    `${API_BASE_URL}projects/${projectId}/suppliers/${encodeURIComponent(
      item.id
    )}`,
    {
      method: "PATCH",
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

export const deleteCurrent = async (companyId: string, code: string) => {
  const res = await fetch(`${API_BASE_URL}/${code}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete error");
};
