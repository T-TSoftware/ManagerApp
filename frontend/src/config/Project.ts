import { Project } from "../types/project/Project";

export const fetchProjects = async (): Promise<Project[]> => {
  return [
    { id: "1", name: "İhsaniye" },
    { id: "2", name: "Bademler" },
    { id: "3", name: "Kemalpaşa" },
  ];
};
