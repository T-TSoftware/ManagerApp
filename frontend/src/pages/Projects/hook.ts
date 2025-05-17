import { useState, useEffect } from "react";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "./service";
import { getToken } from "../../utils/token";
import type { ProjectRows } from "./types";

export const useProject = () => {
  const [localData, setLocalData] = useState<ProjectRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const token = getToken();   

    useEffect(() => {
      fetchData();
    }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllProjects(token!);
      setLocalData(result);
    } catch (err) {
      setAlert({ message: "Veriler yüklenemedi", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getProjectById(token!, id);
    } catch (err) {
      setAlert({ message: "Kayıt alınamadı", type: "error" });
      return undefined;
    }
  };

  const create = async (data: Partial<ProjectRows>) => {
    const newItem = await createProject(token!, data);
    return newItem;
  };

  const update = async (data: Partial<ProjectRows>) => {
    const updatedItem = await updateProject(token!, data);
    return updatedItem;
  };

  const deleteRows = async (selected: ProjectRows[]) => {
    try {
      const record = selected[0];
      await deleteProject(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
      setAlert({ message: "Silme işlemi başarılı", type: "success" });
    } catch (err) {
      setAlert({ message: "Silme işlemi başarısız", type: "error" });
    }
  };

  const addRow = (item: ProjectRows) => {
    setLocalData((prev) => [item, ...prev]);
  };

  const updateRow = (item: ProjectRows) => {
    setLocalData((prev) =>
      prev.map((row) => (row.id === item.id ? item : row))
    );
  };

  const saveChanges = async (allRows: ProjectRows[]) => {
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
