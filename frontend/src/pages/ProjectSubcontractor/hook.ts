import { useEffect, useState } from "react";
import {
  SubcontractorRows
} from "./types";
import { useParams } from "react-router-dom";
import {
  getAllSubcontractorByProject,
  addSubcontractor,
  updateSubcontractor,
  getSubcontractorById
} from "./service";
import { useNotifier } from "../../hooks/useNotifier";
import { getToken } from "../../utils/token";

export const useSubcontractor = () => {
  const [localData, setLocalData] = useState<SubcontractorRows[]>([]);
  const [loading, setLoading] = useState(true);
 
  const { projectId } = useParams();
  const token = getToken();
  const notify = useNotifier();

   useEffect(() => {
     fetchData();
   }, [projectId, token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllSubcontractorByProject(token!, projectId!);
      setLocalData(result);
    } catch (err) {
      notify.error("Bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getSubcontractorById(token!, id);
    } catch (err) {
      notify.error("Bir sorun oluştu.");
      return undefined;
    }
  };

    const create = async (data: Partial<SubcontractorRows>) => {
    const newItem = await addSubcontractor(token!, projectId!, data);
    return newItem;
  };

  const update = async (data: Partial<SubcontractorRows>) => {
    const updatedItem = await updateSubcontractor(token!, data);
    return updatedItem;
  };


  const addRow = (item: SubcontractorRows) => {
    setLocalData((prev) => [item, ...prev]);
  };

  const updateRow = (item: SubcontractorRows) => {
    setLocalData((prev) =>
      prev.map((row) => (row.id === item.id ? item : row))
    );
  };

  const saveChanges = async (allRows: SubcontractorRows[]) => {
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
