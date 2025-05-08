import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, createProject, updateProject } from "./service";
import { ProjectFormValues } from "./types";
import { getToken } from "../../utils/token";

export const useProjectForm = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(projectId);
  const token = getToken();

  const [defaultValues, setDefaultValues] = useState<ProjectFormValues>({
    name: "",
    site: "",
    status: "planned",
    estimatedStartDate: "",
    actualStartDate: "",
    estimatedEndDate: "",
    actualEndDate: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isEdit && projectId ) {
      getProjectById(projectId)
        .then(setDefaultValues)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isEdit, projectId]);

  const onSubmit = async (data: ProjectFormValues) => {
    if (!token) return;
    if (isEdit && projectId) {
      await updateProject(projectId, data);
    } else  {
      await createProject(data, token);
    }
    navigate("/admin-dashboard");
  };

  return { defaultValues, loading, onSubmit, isEdit };
};
