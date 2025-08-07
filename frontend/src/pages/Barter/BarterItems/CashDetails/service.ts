import axios from "../../../../utils/axios";
import type {
  BarterItemCashDetailRows
} from "./types";

export const getCashDetails = async (
  token: string,
  barterId: string
): Promise<BarterItemCashDetailRows[]> => {
  const response = await axios.get(`barter-cashes/${barterId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
