import { useEffect, useMemo, useRef, useState } from "react";
import { SupplyRows} from "./types";
import { useParams } from "react-router-dom";
import {
  getAllSupplies,
  addSupply,
  updateSupply,
  deleteSupply,
  getSupplyById,
} from "./service";
import { useNotifier } from "../../hooks/useNotifier";
import { getToken } from "../../utils/token";
import { BaseGridHandle } from "../../components/grid/BaseGrid";

export const useSupply = () => {
  const [localData, setLocalData] = useState<SupplyRows[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<BaseGridHandle<SupplyRows>>(null);

  const { projectId } = useParams();
  const token = getToken();
  const notify = useNotifier();

     useEffect(() => {
       fetchData();
     }, [projectId, token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllSupplies(token!, projectId!);
      setLocalData(result);
    } catch (err) {
      notify.error("Bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getSupplyById(token!, id);
    } catch (err) {
      notify.error("Bir sorun oluştu.");
      return undefined;
    }
  };

    const create = async (data: Partial<SupplyRows>) => {
    const newItem = await addSupply(token!, projectId!, data);
    return newItem;
  };

  const update = async (data: Partial<SupplyRows>) => {
    const updatedItem = await updateSupply(token!, projectId!, data);
    return updatedItem;
  };


  const addRow = (item: SupplyRows) => {
    setLocalData((prev) => [item, ...prev]);
  };

  const updateRow = (item: SupplyRows) => {
    setLocalData((prev) =>
      prev.map((row) => (row.id === item.id ? item : row))
    );
  };

  const saveChanges = async (allRows: SupplyRows[]) => {
    notify.success("Değişiklikler kaydedildi.");
  };

  return {
    localData,
    loading,
    alert,
    fetchData,
    getById,
    create,
    update,
    addRow,
    updateRow,
    saveChanges,
  };
};
