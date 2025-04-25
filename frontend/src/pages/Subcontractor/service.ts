import { API_BASE_URL } from "../../config/api";
import { SubcontractorRows } from "./subcontractor.types";

export const getAllSubcontractorByProject = async (
  projectId: string,
  token: string
): Promise<SubcontractorRows[]> => {
  const res = await fetch(
    `${API_BASE_URL}projects/${projectId}/subcontractors`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Fetch Error");
  return res.json();
};

export const addSupply = async (
  token: string,
  projectId: string,
  item: Omit<SubcontractorRows, "isNew">
) => {
  const res = await fetch(
    `${API_BASE_URL}projects/${projectId}/subcontractors`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    }
  );
  if (!res.ok) {
    const errMsg = await res.text();
    console.error("Add error →", errMsg);
    throw new Error("Add error");
  }

  return res.json();
};

export const updateSupply = async (
  token: string,
  projectId: string,
  item: SubcontractorRows
) => {
  const res = await fetch(
    `${API_BASE_URL}projects/${projectId}/subcontractors/${encodeURIComponent(
      item.code
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

export const deleteSupply = async (companyId: string, code: string) => {
  const res = await fetch(`${API_BASE_URL}/${code}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete error");
};
