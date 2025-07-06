import axios from "../../utils/axios";
import { SubcontractorRows, NewSubcontractorPayload, UpdateSubcontractorPayload } from "./types";

export const getAllSubcontractorByProject = async (
  projectId: string,
  token: string
): Promise<SubcontractorRows[]> => {
  const res = await axios.get(`/projects/${projectId}/subcontractors`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const addSubcontractor = async (
  token: string,
  projectId: string,
  payload: NewSubcontractorPayload[]
): Promise<void> => {
  const res = await axios.post(
    `/projects/${projectId}/subcontractors`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const updateSubcontractor = async (
  token: string,
  projectId: string,
  payload: UpdateSubcontractorPayload[]
): Promise<void> => {
  const res = await axios.put(
    `/projects/${projectId}/subcontractors`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteSubcontractor = async (
  token: string,
  projectId: string,
  codes: string[]
): Promise<void> => {
  const res = await axios.delete(`/projects/${projectId}/subcontractors`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: codes,
  });
  return res.data;
};
