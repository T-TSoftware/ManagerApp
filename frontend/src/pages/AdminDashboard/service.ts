import axios from "../../utils/axios";
import { UpcomingPaymentsRows } from "./type";

export const getEURCurrency = async () => {
  const res = await axios.get(
    `https://api.frankfurter.app/latest?from=EUR&to=TRY`
  );
  return res.data.rates.TRY;
};

export const getUSDCurrency = async () => {
  const res = await axios.get(
    `https://api.frankfurter.app/latest?from=USD&to=TRY`
  );
  return res.data.rates.TRY;
};

export const getAllUpcomingPayments = async (
  token: string
): Promise<UpcomingPaymentsRows[]> => {
  const response = await axios.get(`/upcoming/payments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllUpcomingCollections = async (
  token: string
): Promise<UpcomingPaymentsRows[]> => {
  const response = await axios.get(`/upcoming/collections`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
