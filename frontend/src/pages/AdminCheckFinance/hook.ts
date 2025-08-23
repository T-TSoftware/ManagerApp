import { useState, useEffect } from "react";
import {
  getAllChecks,
  getCheckById,
  addCheck,
  updateCheck,
  deleteCheck,
  fetchAccounts,
} from "./service";
import { getToken } from "../../utils/token";
import type { CheckFinanceRows } from "./types";
import { useNotifier } from "../../hooks/useNotifier";
import { AutocompleteOptionById } from "../../types/grid/commonTypes";
import { extractApiError } from "../../utils/axios";

export const useCheckFinance = () => {
  const [localData, setLocalData] = useState<CheckFinanceRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [accountOptions, setAccountOptions] = useState<
    AutocompleteOptionById[]
  >([]);
  const [alert, setAlert] = useState<any>(null);
  const notify = useNotifier();
  const token = getToken();

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllChecks(token!);
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
      return await getCheckById(token!, id);
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      notify.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const create = async (
    data: Partial<CheckFinanceRows>
  ): Promise<CheckFinanceRows> => {
    try {
      const newItem = await addCheck(token!, data);
      return newItem;
    } catch (err) {
      const { errorMessage } = extractApiError(err);
       throw new Error(errorMessage); 
    }
  };

  const update = async (
    data: Partial<CheckFinanceRows>
  ): Promise<CheckFinanceRows> => {
    try {
      const updatedItem = await updateCheck(token!, data);
      return updatedItem;
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const deleteRows = async (selected: CheckFinanceRows[]) => {
    try {
      const record = selected[0];
      await deleteCheck(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
    } catch (err) {
       const { errorMessage } = extractApiError(err);
       throw new Error(errorMessage);
    }
  };

  const addRow = (item: CheckFinanceRows) => {
    setLocalData((prev) => [item, ...prev]);
  };

  const updateRow = (item: CheckFinanceRows) => {
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
