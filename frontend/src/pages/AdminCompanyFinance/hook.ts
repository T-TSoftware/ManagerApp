import { useState, useEffect } from "react";
import {
  getAllFinance,
  getFinanceById,
  addFinance,
  updateFinance,
  deleteFinance,
  fetchAccounts,
} from "./service";
import { getToken } from "../../utils/token";
import type { FinanceTransactionRows } from "./types";
import { useNotifier } from "../../hooks/useNotifier";
import { AutocompleteOption } from "../../types/grid/commonTypes";
import { extractApiError } from "../../utils/axios";

export const useFinance = () => {
  const [localData, setLocalData] = useState<FinanceTransactionRows[]>([]);
  const [accountOptions, setAccountOptions] = useState<AutocompleteOption[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const notify = useNotifier();
  const token = getToken();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllFinance(token!);
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
      return await getFinanceById(token!, id);
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const create = async (data: Partial<FinanceTransactionRows>) => {
    try {
      const newItems = await addFinance(token!, data); // her zaman dizi
      return newItems;
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const update = async (data: Partial<FinanceTransactionRows>) => {
    try {
      const updatedItem = await updateFinance(token!, data);
      return updatedItem;
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const deleteRows = async (selected: FinanceTransactionRows[]) => {
    try {
      const record = selected[0];
      await deleteFinance(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const addRow = (items: FinanceTransactionRows | FinanceTransactionRows[]) => {
    setLocalData((prev) => {
      const arr = Array.isArray(items) ? items : [items];
      console.log(arr);
      return [...arr, ...prev];
    });
  };

  const updateRow = (item: FinanceTransactionRows) => {
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
  };
};
