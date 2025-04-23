import { useEffect, useState } from "react";
import { getAllProjects } from "../components/menu/projectMenu/ProjectService";
import { Project } from "../types/project/Project";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading ] = useState(true);

  useEffect(() => {
    getAllProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading };
};
