import { BoldIcon } from "@heroicons/react/24/outline";
import { API_BASE_URL } from "../../config/api";
import { ProjectFormValues } from "./types";

export const getProjectById = async (
  id: string
): Promise<ProjectFormValues> => {
  const res = await fetch(`${API_BASE_URL}projects/${id}`);
  if (!res.ok) throw new Error("Proje alınamadı.");
  return res.json();
};

export const createProject = async (project: ProjectFormValues, token: string) => {
  const res = await fetch(`${API_BASE_URL}projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });
  console.log("body", JSON.stringify(project));
  if (!res.ok) throw new Error("Proje oluşturulamadı.");
  return res.json();
};

export const updateProject = async (id: string, project: ProjectFormValues) => {
  const res = await fetch(`${API_BASE_URL}projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error("Proje güncellenemedi.");
  return res.json();
};
