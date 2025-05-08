import { useEffect, useState } from "react";
import { CurrentRows } from "./current.types";
import { useParams } from "react-router-dom";
import {
  getAllCurrents,
  addCurrent,
  updateCurrent,
  deleteCurrent,
} from "./service";
import { getToken } from "../../utils/token";

export const useCurrent = () => {
  const [originalData, setOriginalData] = useState<CurrentRows[]>([]);
  const [localData, setLocalData] = useState<CurrentRows[]>([]);
  const [deletedRows, setDeletedRows] = useState<CurrentRows[]>([]);
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams();
  const token = getToken();

  useEffect(() => {
    fetchData();
  }, []);

  //Get Data's

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!projectId || !token) return;
      const data = await getAllCurrents(projectId, token);
      setOriginalData(data);
      setLocalData(data);
      setDeletedRows([]);
    } finally {
      setLoading(false);
    }
  };
  //CRUD

  const addRow = () => {
    const newRow: CurrentRows = {
      id: "",
      balanceCode: "",
      type: "",
      amount: "",
      currency: "TRY",
      description: "",
      transactionDate: new Date(),
      createdBy: "",
      updatedBy: "",
      createdatetime: new Date(),
      updatedatetime: new Date(),
      isNew: true,
    };
    setLocalData((prev) => [newRow, ...prev]);
  };

  const updateRow = (row: CurrentRows) => {
    setLocalData((prev) =>
      prev.map((item) => (item.id === row.id ? row : item))
    );
  };

  const deleteRows = (selected: CurrentRows[]) => {
    setLocalData((prev) =>
      prev.filter((item) => !selected.find((s) => s.id === item.id))
    );
    setDeletedRows((prev) => [...prev, ...selected]);
  };

  const saveChanges = async () => {
    const added = localData.filter((item) => item.isNew);
    const updated = localData.filter(
      (item) =>
        !item.isNew &&
        originalData.some(
          (orig) =>
            orig.id === item.id && JSON.stringify(orig) !== JSON.stringify(item)
        )
    );
    try {
      if (deletedRows.length > 0) {
        if (!projectId || !token) return;
        await Promise.all(
          deletedRows.map((item) => deleteCurrent(projectId, item.id))
        );
      }
      if (added.length > 0) {
        if (!projectId || !token) return;
        await Promise.all(
          added.map(({ isNew, ...row }) => {
            return addCurrent(token, projectId, row);
          })
        );
      }
      if (updated.length > 0) {
        if (!projectId || !token) return;
        await Promise.all(
          updated.map((row) => updateCurrent(token, projectId, row))
        );
      }
      await fetchData();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  return { localData, loading, addRow, updateRow, deleteRows, saveChanges };
};
