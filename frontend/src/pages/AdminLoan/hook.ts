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
import { AutocompleteOption } from "../../types/grid/commonTypes";


export const useLoan = () => {
  const [localData, setLocalData] = useState<LoansRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const [accountOptions, setAccountOptions] = useState<AutocompleteOption[]>(
  []
   );
  const notify = useNotifier();
  const token = getToken();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllLoans(token!);
      const optionResult = await fetchAccounts(token!);
      setLocalData(result);
      setAccountOptions(optionResult);
    } catch (err) {
      notify.error("Bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getLoanById(token!, id);
    } catch (err) {
       notify.error("Bir sorun oluştu.");
      return undefined;
    }
  };

  const create = async (data: Partial<LoansRows>) => {
    const newItem = await addLoan(token!, data);
    return newItem;
  };

  const update = async (data: Partial<LoansRows>) => {
    const updatedItem = await updateLoan(token!, data);
    return updatedItem;
  };

  const deleteRows = async (selected: LoansRows[]) => {
    try {
      const record = selected[0];
      await deleteLoan(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
    } catch (err) {
       notify.error("Bir sorun oluştu.");
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

  const saveChanges = async (allRows: LoansRows[]) => {
     notify.success("Değişiklikler kaydedildi");
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
    saveChanges,
  };
};
