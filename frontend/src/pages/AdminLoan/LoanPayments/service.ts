import axios from "../../../utils/axios";
import type { LoanPaymentRows, NewLoanPaymentPayload } from "./types";

export const getAllLoanPayments = async (
  token: string,
  loanId: string
): Promise<LoanPaymentRows[]> => {
  const response = await axios.get(`loan-payments/loan/${loanId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response)
  return response.data.loanPayments;
};

export const getLoanPaymentById = async (
  token: string,
  loanPaymentId: string
): Promise<LoanPaymentRows> => {
  const response = await axios.get(`loan-payments/${loanPaymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addLoanPayments = async (
  token: string,
  items: NewLoanPaymentPayload[],
  loanId:string
): Promise<void> => {
  const res = await axios.post(`loan-payments/${loanId}`, items, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateLoanPayments = async (
  token: string,
  data: Partial<LoanPaymentRows>
): Promise<LoanPaymentRows> => {
  const response = await axios.patch(`loan-payments/${data.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteLoanPayments = async (
  token: string,
  codes: string[]
): Promise<void> => {
  const res = await axios.delete(`loan-payments`, {
    data: codes,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};