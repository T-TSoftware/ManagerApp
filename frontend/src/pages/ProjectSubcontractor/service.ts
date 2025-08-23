import axios from "../../utils/axios";
import { SubcontractorRows} from "./types";

export const getAllSubcontractorByProject = async (
  token: string,
  projectId: string,
): Promise<SubcontractorRows[]> => {
  const response = await axios.get(`/projects/${projectId}/subcontractors`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getSubcontractorById = async (
  token: string,
  id: string
): Promise<SubcontractorRows> => {
  const response = await axios.get(`subcontractor/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addSubcontractor = async (
  token: string,
  projectId: string,
  data: Partial<SubcontractorRows>
): Promise<SubcontractorRows> => {
  const response = await axios.post(
    `/projects/${projectId}/subcontractors`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateSubcontractor = async (
  token: string,
  data: Partial<SubcontractorRows>
): Promise<SubcontractorRows> => {
  const response = await axios.patch(
    `/projects/subcontractors/${data.id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

