import { useEffect, useState } from "react";
import { SubcontractorRows } from "./subcontractor.types";
import { useParams } from "react-router-dom";
import {
  getAllSubcontractorByProject,
  addSupply,
  updateSupply,
  deleteSupply,
} from "./service";
import { getToken } from "../../utils/token";

export const useSubcontractor = () => {
  const [originalData, setOriginalData] = useState<SubcontractorRows[]>([]);
  const [localData, setLocalData] = useState<SubcontractorRows[]>([]);
  const [deletedRows, setDeletedRows] = useState<SubcontractorRows[]>([]);
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
      const data = await getAllSubcontractorByProject(projectId, token);
      setOriginalData(data);
      setLocalData(data);
      setDeletedRows([]);
    } finally {
      setLoading(false);
    }
  };
  //CRUD

  const addRow = () => {
    const newRow: SubcontractorRows = {
      code: "",
      category: "",
      companyName: "",
      unit: "",
      unitPrice: 0,
      quantity: 0,
      contractAmount: 0,
      paidAmount: 0,
      remainingAmount: 0,
      status: "Pending",
      description: "",
      createdBy: "",
      updatedBy: "",
      createdatetime: new Date(),
      updatedatetime: new Date(),
      isNew: true,
    };
    setLocalData((prev) => [newRow, ...prev]);
  };

  const updateRow = (row: SubcontractorRows) => {
    setLocalData((prev) =>
      prev.map((item) => (item.code === row.code ? row : item))
    );
  };

  const deleteRows = (selected: SubcontractorRows[]) => {
    setLocalData((prev) =>
      prev.filter((item) => !selected.find((s) => s.code === item.code))
    );
    setDeletedRows((prev) => [...prev, ...selected]);
  };

  const saveChanges = async () => {
    const added = localData.filter((item) => item.isNew);
    console.log("Gönderilecek veri:", added);
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
          deletedRows.map((item) => deleteSupply(projectId, item.code))
        );
      }
      if (added.length > 0) {
        if (!projectId || !token) return;
        await Promise.all(
          added.map(({ isNew, ...row }) => {
            return addSupply(token, projectId, row);
          })
        );
      }
      if (updated.length > 0) {
        if (!projectId || !token) return;
        await Promise.all(
          updated.map((row) => updateSupply(token, projectId, row))
        );
      }
      await fetchData();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  return { localData, loading, addRow, updateRow, deleteRows, saveChanges };
};
