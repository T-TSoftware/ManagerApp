import type { ProjectRows } from "./types";
import { API_BASE_URL } from "../../config/api";

export const getAllProjects = async (token: string): Promise<ProjectRows[]> => {
  const res = await fetch(`${API_BASE_URL}projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};

export const getProjectById = async (token: string,id: string): Promise<ProjectRows> => {
  const res = await fetch(`${API_BASE_URL}projects/${id}`);
  if (!res.ok) throw new Error("Failed to fetch project");
  return res.json();
};

export const createProject = async (token: string,
  data: Partial<ProjectRows>
): Promise<ProjectRows> => {
  const res = await fetch(`${API_BASE_URL}projects`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`,"Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
};

export const updateProject = async (token: string,
  data: Partial<ProjectRows>
): Promise<ProjectRows> => {
  const res = await fetch(`${API_BASE_URL}projects/${data.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update project");
  return res.json();
};

export const deleteProject = async (token: string, id: string) => {
  const res = await fetch(`${API_BASE_URL}projects/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete project");
};
