import { data } from "react-router-dom";
import axios from "../../utils/axios";
import { QuantityRows} from "./types";

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

export const getQuantityById = async (
  projectId: string,
  token: string
): Promise<QuantityRows> => {
  const res = await axios.get(
    `/projects/${projectId}/quantities/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const addQuantity = async (
  token: string,
  projectId: string,
  data: Partial<QuantityRows>
): Promise<QuantityRows> => {
  const res = await axios.post(`/projects/${projectId}/quantities`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateQuantity = async (
  token: string,
  projectId: string,
  data: Partial<QuantityRows>
): Promise<QuantityRows> => {
  const res = await axios.put(`/projects/${projectId}/quantities`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteQuantity = async (
  token: string,
  projectId: string
): Promise<QuantityRows> => {
  const res = await axios.delete(`/projects/${projectId}/quantities`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
