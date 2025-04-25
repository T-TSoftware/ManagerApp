import { API_BASE_URL } from "../../../config/api";
import { Project } from "../../../types/project/Project";

export const getAllProjects = async (token: string): Promise<Project[]> => {
  const res = await fetch(`${API_BASE_URL}projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Fetch Error.");
  return res.json();
};
