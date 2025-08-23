import { SupplyRows} from "./types";
import axios from "../../utils/axios";

export const getAllSupplies = async (
  token: string,
  projectId: string,
): Promise<SupplyRows[]> => {
  const response = await axios.get(`/projects/${projectId}/suppliers`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log(response)
  return response.data;
};

export const getSupplyById = async (
  token: string,
  id: string
): Promise<SupplyRows> => {
  const response = await axios.get(`supplier/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addSupply = async (
  token: string,
  projectId: string,
  data: Partial<SupplyRows>
): Promise<SupplyRows> => {
  const response = await axios.post(`projects/${projectId}/suppliers`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateSupply = async (
  token: string,
  projectId: string,
  data: Partial<SupplyRows>
): Promise<SupplyRows> => {
  const response = await axios.patch(`projects/suppliers/${data.id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteSupply = async (
  token: string,
  projectId: string,
  supplyId: string
): Promise<SupplyRows> => {
  const response = await axios.delete(`projects/${projectId}/suppliers/${supplyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
   return response.data;
};
