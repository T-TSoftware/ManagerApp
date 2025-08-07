import { useEffect, useState } from "react";
import { getAllProjects } from "../components/menu/projectMenu/ProjectService";
import { Project } from "../types/project/Project";
import { getToken } from "../utils/token";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const token = getToken();

  useEffect(() => {
    if (!token) return;
    getAllProjects(token)
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const projectOptionsByCode = projects.map((p) => ({
    code: p.code,
    name: p.name,
  }));


  const projectOptionsById = projects.map((p) => ({
    code: p.id, 
    name: p.name,
  }));

  return {
    projects,
    loading,
    projectOptionsByCode,
    projectOptionsById,
  };
};
