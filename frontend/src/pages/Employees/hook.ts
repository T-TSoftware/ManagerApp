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
import { extractApiError } from "../../utils/axios";

export const useEmployees = () => {
  const [localData, setLocalData] = useState<EmployeesRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const notify = useNotifier();
  const token = getToken();

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllEmployees(token!);
      setLocalData(result);
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getEmployeeById(token!, id);
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const create = async (data: Partial<EmployeesRows>) => {
    try {
      const newItem = await addEmployee(token!, data);
      return newItem;
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const update = async (data: Partial<EmployeesRows>) => {
   try {
     const updatedItem = await updateEmployee(token!, data);
     return updatedItem;
   } catch (err) {
     const { errorMessage } = extractApiError(err);
     throw new Error(errorMessage);
   }
    
  };

  const deleteRows = async (selected: EmployeesRows[]) => {
    try {
      const record = selected[0];
      await deleteEmployee(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
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
  };
};
