import axios from "../../utils/axios";
import { CurrentRows } from "./types";

export const getAllCurrents = async (
  token: string
): Promise<CurrentRows[]> => {
const response = await axios.get(`current-movements`, {
  headers: { Authorization: `Bearer ${token}` },
});
  return response.data;
};

