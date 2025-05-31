import axios from "../../utils/axios";
import { QuantityRows, NewQuantityPayload, UpdateQuantityPayload } from "./quantity.types";

export const getAllQuantityByProject = async (
  projectId: string,
  token: string
): Promise<QuantityRows[]> => {
  const res = await axios.get(`/projects/${projectId}/quantities`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const addQuantity = async (
  token: string,
  projectId: string,
  payload: NewQuantityPayload[]
): Promise<void> => {
  const res = await axios.post(
    `/projects/${projectId}/quantities`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const updateQuantity = async (
  token: string,
  projectId: string,
  payload: UpdateQuantityPayload[]
): Promise<void> => {
  const res = await axios.put(
    `/projects/${projectId}/quantities`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteQuantity = async (
  token: string,
  projectId: string,
  codes: string[]
): Promise<void> => {
  const res = await axios.delete(`/projects/${projectId}/quantities`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: codes,
  });
  return res.data;
};
