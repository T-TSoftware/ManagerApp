/* import { useState, useEffect } from "react";
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "./service";
import { getToken } from "../../utils/token";
import type { SupplierListRows } from "./types";

export const useSupplierList = () => {
  const [localData, setLocalData] = useState<SupplierListRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const token = getToken();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllSuppliers(token!);
      setLocalData(result);
    } catch (err) {
      setAlert({ message: "Veriler yüklenemedi", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getSupplierById(token!, id);
    } catch (err) {
      setAlert({ message: "Kayıt alınamadı", type: "error" });
      return undefined;
    }
  };

  const create = async (data: Partial<SupplierListRows>) => {
    const newItem = await createSupplier(token!, data);
    return newItem;
  };

  const update = async (data: Partial<SupplierListRows>) => {
    const updatedItem = await updateSupplier(token!, data);
    return updatedItem;
  };

  const deleteRows = async (selected: SupplierListRows[]) => {
    try {
      const record = selected[0];
      await deleteSupplier(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
      setAlert({ message: "Silme işlemi başarılı", type: "success" });
    } catch (err) {
      setAlert({ message: "Silme işlemi başarısız", type: "error" });
    }
  };

  const addRow = (item: SupplierListRows) => {
    setLocalData((prev) => [item, ...prev]);
  };

  const updateRow = (item: SupplierListRows) => {
    setLocalData((prev) =>
      prev.map((row) => (row.id === item.id ? item : row))
    );
  };

  const saveChanges = async (allRows: SupplierListRows[]) => {
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
 */