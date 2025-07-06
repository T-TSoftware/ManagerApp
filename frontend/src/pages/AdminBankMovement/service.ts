import axios from "../../utils/axios";
import { BankMovementRows } from "./types";

export const getAllBankMovements = async (
  token: string
): Promise<BankMovementRows[]> => {
  const response = await axios.get(`bank-movements`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response.data);
  return response.data;
};

