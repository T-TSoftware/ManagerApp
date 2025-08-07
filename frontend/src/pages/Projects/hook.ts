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
import { useNotifier } from "../../hooks/useNotifier";


export const useProject = () => {
  const [localData, setLocalData] = useState<ProjectRows[]>([]);
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
      const result = await getAllProjects(token!);
      setLocalData(result);
    } catch (err) {
      notify.error("Bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getProjectById(token!, id);
    } catch (err) {
      notify.error("Bir sorun oluştu.");
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
    } catch (err) {
      notify.error("Bir sorun oluştu.");
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
