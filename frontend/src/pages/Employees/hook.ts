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


export const useEmployees = () => {
  const [localData, setLocalData] = useState<EmployeesRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
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
      setAlert({ message: "Veriler yüklenemedi", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getEmployeeById(token!, id);
    } catch (err) {
      setAlert({ message: "Kayıt alınamadı", type: "error" });
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
      setAlert({ message: "Silme işlemi başarılı", type: "success" });
    } catch (err) {
      setAlert({ message: "Silme işlemi başarısız", type: "error" });
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
    console.log("Tüm kayıtlar kaydedildi:", allRows);
    setAlert({ message: "Değişiklikler kaydedildi", type: "success" });
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
