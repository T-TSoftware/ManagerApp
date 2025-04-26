import { useEffect, useState } from "react";
import { QuantityRows } from "./quantity.types";
import { useParams } from "react-router-dom";
import {
  getAllQuantities,
  addQuantity,
  updateQuantity,
  deleteQuantity,
} from "./service";
import { getToken } from "../../utils/token";

export const useQuantity = () => {
  const [originalData, setOriginalData] = useState<QuantityRows[]>([]);
  const [localData, setLocalData] = useState<QuantityRows[]>([]);
  const [deletedRows, setDeletedRows] = useState<QuantityRows[]>([]);
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
      const data = await getAllQuantities(projectId, token);
      setOriginalData(data);
      setLocalData(data);
      setDeletedRows([]);
    } finally {
      setLoading(false);
    }
  };
  //CRUD

  const addRow = () => {
    const newRow: QuantityRows = {
      id:"",
      code: "",
      quantityItemCode: "",
      quantityItemName: "",
      quantity: 0,
      unit: "",
      description: "",
      category: "",
      createdBy: "",
      updatedBy: "",
      createdatetime: new Date(),
      updatedatetime: new Date(),
      isNew: true,
    };
    setLocalData((prev) => [...prev, newRow]);
  };

  const updateRow = (row: QuantityRows) => {
    setLocalData((prev) =>
      prev.map((item) => (item.code === row.code ? row : item))
    );
  };

  const deleteRows = (selected: QuantityRows[]) => {
    setLocalData((prev) =>
      prev.filter((item) => !selected.find((s) => s.code === item.code))
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
            orig.code === item.code &&
            JSON.stringify(orig) !== JSON.stringify(item)
        )
    );
    try {
      if (deletedRows.length > 0) {
        if (!projectId || !token) return;
        await Promise.all(
          deletedRows.map((item) => deleteQuantity(projectId, item.code))
        );
      }
      if (added.length > 0) {
        if (!projectId || !token) return;
        await Promise.all(
          added.map(({ isNew, ...row }) => {
            return addQuantity(token, projectId, row);
          })
        );
      }
      if (updated.length > 0) {
        if (!projectId || !token) return;
        await Promise.all(
          updated.map((row) => updateQuantity(token, projectId, row))
        );
      }
      await fetchData();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  return { localData, loading, addRow, updateRow, deleteRows, saveChanges };
};
