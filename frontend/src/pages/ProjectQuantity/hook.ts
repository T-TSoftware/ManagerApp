import { useEffect, useState, useRef, useMemo } from "react";
import { QuantityRows} from "./types";
import { useParams } from "react-router-dom";
import {
  getAllQuantityByProject,
  addQuantity,
  updateQuantity,
  deleteQuantity,
  getQuantityById,
} from "./service";
import { useNotifier } from "../../hooks/useNotifier";
import { getToken } from "../../utils/token";

export const useQuantity = () => {
  const [localData, setLocalData] = useState<QuantityRows[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<any>(null);
  const { projectId } = useParams();
  const token = getToken();
  const notify = useNotifier();

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllQuantityByProject(projectId!, token!);
      setLocalData(result);
    } catch (err) {
      notify.error("Bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId, token]);

  const getById = async (id: string) => {
    try {
      return await getQuantityById(token!, id);
    } catch (err) {
      notify.error("Bir sorun oluştu.");
      return undefined;
    }
  };

  const create = async (data: Partial<QuantityRows>) => {
    const newItem = await addQuantity(token!, projectId!, data);
    return newItem;
  };
const update = async (data: Partial<QuantityRows>) => {
  const updatedItem = await updateQuantity(token!, projectId!, data);
  return updatedItem;
};

const deleteRows = async (selected: QuantityRows[]) => {
  try {
    const record = selected[0];
    await deleteQuantity(token!, projectId!);
    setLocalData((prev) => prev.filter((r) => r.id !== record.id));
  } catch (err) {
    notify.error("Bir sorun oluştu.");
  }
};

const addRow = (item: QuantityRows) => {
  setLocalData((prev) => [item, ...prev]);
};

const updateRow = (item: QuantityRows) => {
  setLocalData((prev) => prev.map((row) => (row.id === item.id ? item : row)));
};

const saveChanges = async (allRows: QuantityRows[]) => {
  notify.error("Değişiklikler kaydedildi");
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
