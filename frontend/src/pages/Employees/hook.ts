import { useState, useEffect } from "react";
import {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "./service";
import { getToken } from "../../utils/token";
import type { EmployeesRows } from "./types";
import { useNotifier } from "../../hooks/useNotifier";

export const useEmployees = () => {
  const [localData, setLocalData] = useState<EmployeesRows[]>([]);
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
      const result = await getAllEmployees(token!);
      setLocalData(result);
    } catch (err) {
      notify.error("Bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getEmployeeById(token!, id);
    } catch (err) {
      notify.error("Bir sorun oluştu.");
      return undefined;
    }
  };

  const create = async (data: Partial<EmployeesRows>) => {
    const newItem = await addEmployee(token!, data);
    return newItem;
  };

  const update = async (data: Partial<EmployeesRows>) => {
    const updatedItem = await updateEmployee(token!, data);
    return updatedItem;
  };

  const deleteRows = async (selected: EmployeesRows[]) => {
    try {
      const record = selected[0];
      await deleteEmployee(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
    } catch (err) {
      notify.error("Bir sorun oluştu.");
    }
  };

  const addRow = (item: EmployeesRows) => {
    setLocalData((prev) => [item, ...prev]);
  };

  const updateRow = (item: EmployeesRows) => {
    setLocalData((prev) =>
      prev.map((row) => (row.id === item.id ? item : row))
    );
  };

  const saveChanges = async (allRows: EmployeesRows[]) => {
    notify.success("Değişiklikler kaydedildi.");
  };

  return {
    localData,
    loading,
    alert,
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
