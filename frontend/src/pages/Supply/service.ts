import axios from "../../utils/axios";
import { SupplyRows } from "./supply.types";

export const getAllSupplies = async (
  projectId: string,
  token: string
): Promise<SupplyRows[]> => {
  const res = await axios.get(`projects/${projectId}/suppliers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const addSupply = async (
  token: string,
  projectId: string,
  item: Omit<SupplyRows, "isNew">[]
) => {
  const res = await axios.post(
    `projects/${projectId}/suppliers`,
    item,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const updateSupply = async (
  token: string,
  projectId: string,
  item: Omit<SupplyRows, "isNew">[]
) => {
  const res = await axios.patch(
    `projects/${projectId}/suppliers`,
    item,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteSupply = async (
  token: string,
  projectId: string,
  code: string
) => {
  const res = await axios.delete(
    `projects/${projectId}/suppliers/${encodeURIComponent(code)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
