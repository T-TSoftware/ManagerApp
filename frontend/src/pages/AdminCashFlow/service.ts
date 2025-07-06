import axios from "../../utils/axios";
import { CashFlowRows } from "./types";

export const getAllCashFlows = async (token: string): Promise<CashFlowRows[]> => {
  const response = await axios.get(`cash-flow`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

