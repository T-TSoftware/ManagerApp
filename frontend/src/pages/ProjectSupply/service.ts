import { SupplyRows, NewSupplyPayload, UpdateSupplyPayload } from "./types";
import axios from "../../utils/axios";

export const getAllSupplies = async (
  projectId: string,
  token: string
): Promise<SupplyRows[]> => {
  const response = await axios.get(`/projects/${projectId}/suppliers`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const addSupply = async (
  token: string,
  projectId: string,
  payload: NewSupplyPayload[]
): Promise<void> => {
  await axios.post(
    `projects/${projectId}/suppliers`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const updateSupply = async (
  token: string,
  projectId: string,
  payload: UpdateSupplyPayload[]
): Promise<void> => {
  await axios.patch(
    `projects/${projectId}/suppliers`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteSupply = async (
  token: string,
  projectId: string,
  supplyId: string
): Promise<void> => {
  await axios.delete(
    `projects/${projectId}/suppliers/${supplyId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
