import { useState, useEffect } from "react";
import {
  getAllSubcontractorList,
  getSubcontractorById,
  createSubcontractor,
  updateSubcontractor,
  deleteSubcontractor,
} from "./service";
import { getToken } from "../../utils/token";
import type { SubcontractorListRows } from "./types";

export const SubcontractorList = () => {
  const [localData, setLocalData] = useState<SubcontractorListRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const token = getToken();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllSubcontractorList(token!);
      setLocalData(result);
    } catch (err) {
      setAlert({ message: "Veriler yüklenemedi", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getSubcontractorById(token!, id);
    } catch (err) {
      setAlert({ message: "Kayıt alınamadı", type: "error" });
      return undefined;
    }
  };

  const create = async (data: Partial<SubcontractorListRows>) => {
    const newItem = await createSubcontractor(token!, data);
    return newItem;
  };

  const update = async (data: Partial<SubcontractorListRows>) => {
    const updatedItem = await updateSubcontractor(token!, data);
    return updatedItem;
  };

  const deleteRows = async (selected: SubcontractorListRows[]) => {
    try {
      const record = selected[0];
      await deleteSubcontractor(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
      setAlert({ message: "Silme işlemi başarılı", type: "success" });
    } catch (err) {
      setAlert({ message: "Silme işlemi başarısız", type: "error" });
    }
  };

  const addRow = (item: SubcontractorListRows) => {
    setLocalData((prev) => [item, ...prev]);
  };

  const updateRow = (item: SubcontractorListRows) => {
    setLocalData((prev) =>
      prev.map((row) => (row.id === item.id ? item : row))
    );
  };

  const saveChanges = async (allRows: SubcontractorListRows[]) => {
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
