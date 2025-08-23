import type { ProjectRows } from "./types";
import axios from "../../utils/axios";

export const getAllProjects = async (token: string): Promise<ProjectRows[]> => {
    const response = await axios.get(`projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getProjectById = async (token: string,id: string): Promise<ProjectRows> => {
  const response = await axios.get(`projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createProject = async (token: string,
  data: Partial<ProjectRows>
): Promise<ProjectRows> => {
  const response = await axios.post(`projects`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response)
  return response.data;
};

export const updateProject = async (token: string,
  data: Partial<ProjectRows>
): Promise<ProjectRows> => {
  const response = await axios.patch(`projects/${data.id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteProject = async (token: string, id: string) => {
 await axios.delete(`projects/${id}`, {
   headers: { Authorization: `Bearer ${token}` },
 });
};
