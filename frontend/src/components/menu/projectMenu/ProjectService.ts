import { fetchProjects } from "../../../config/Project";

export const getProjects = async () => {
  return await fetchProjects();
};
