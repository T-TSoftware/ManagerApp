import { useState, useEffect } from "react";
import {
  getAllLoans,
  getLoanById,
  addLoan,
  updateLoan,
  deleteLoan,
  fetchAccounts,
} from "./service";
import { getToken } from "../../utils/token";
import type { LoansRows } from "./types";
import { useNotifier } from "../../hooks/useNotifier";
import { AutocompleteOptionById } from "../../types/grid/commonTypes";
import { extractApiError } from "../../utils/axios";
import { LoanPaymentRows } from "./LoanPayments/types";
import { getAllLoanPayments } from "./LoanPayments/service";

export const useLoan = () => {
  const [localData, setLocalData] = useState<LoansRows[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [loanPayments, setLoanPayments] = useState<LoanPaymentRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const [accountOptions, setAccountOptions] = useState<
    AutocompleteOptionById[]
  >([]);
  const notify = useNotifier();
  const token = getToken();

  useEffect(() => {
    fetchData();
  }, [token]);

  // Parent row seçildiğinde çağrılır
  const handleRowSelection = (loanId: string) => {
    setSelectedLoanId(loanId);
    fetchLoanPayment(loanId);
  };

  // API'den child grid verisi çekilir
  const fetchLoanPayment = async (loanId: string) => {
    try {
      const response = await getAllLoanPayments(token!, loanId);
      setLoanPayments(response);
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      notify.error(errorMessage);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllLoans(token!);
      const optionResult = await fetchAccounts(token!);
      setLocalData(result);
      setAccountOptions(optionResult);
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getLoanById(token!, id);
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const create = async (data: Partial<LoansRows>) => {
    try {
      const newItem = await addLoan(token!, data);
      return newItem;
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const update = async (data: Partial<LoansRows>) => {
    try {
      const updatedItem = await updateLoan(token!, data);
      return updatedItem;
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const deleteRows = async (selected: LoansRows[]) => {
    try {
      const record = selected[0];
      await deleteLoan(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const addRow = (item: LoansRows) => {
    setLocalData((prev) => [item, ...prev]);
  };

  const updateRow = (item: LoansRows) => {
    setLocalData((prev) =>
      prev.map((row) => (row.id === item.id ? item : row))
    );
  };

  return {
    localData,
    loading,
    alert,
    accountOptions,
    setAlert,
    fetchData,
    getById,
    create,
    update,
    deleteRows,
    addRow,
    updateRow,
    selectedLoanId,
    setSelectedLoanId,
  };
};
