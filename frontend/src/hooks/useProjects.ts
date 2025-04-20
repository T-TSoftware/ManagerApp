import { useEffect, useState } from "react";
import { getProjects } from "../components/menu/projectMenu/ProjectService";
import { Project } from "../types/project/Project";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  return { projects };
};
