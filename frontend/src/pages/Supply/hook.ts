import { useEffect, useState } from "react";
import { SupplyRows } from "./supply.types";
import { useParams } from "react-router-dom";
import {
  getAllSupplies,
  addSupply,
  updateSupply,
  deleteSupply,
} from "./service";
import { useApp } from "../../hooks/useApp";

export const useSupply = () => {
  const [originalData, setOriginalData] = useState<SupplyRows[]>([]);
  const [localData, setLocalData] = useState<SupplyRows[]>([]);
  const [deletedRows, setDeletedRows] = useState<SupplyRows[]>([]);
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams();
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MjkwMWU0ZC02ZTk0LTQxYmUtODM3NC05OWJlNDliMTgxY2IiLCJjb21wYW55SWQiOiIzZTZlZDFhNC1jNWFhLTRjOTctYTYwMy05Yjk4MDZkMzI4N2IiLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc0NTQ0MjI2MywiZXhwIjoxNzQ1NDQ5NDYzfQ.c2KIzrcq1zTdk3rT8LC01TXaLZGSmQOAt_aWfV9hPD4";

  useEffect(() => {
    fetchData();
  }, []);

  //Get Data's
  
  const fetchData = async () => {
    setLoading(true);
    try {
      if (!projectId) return;
      const data = await getAllSupplies(projectId, token);
      setOriginalData(data);
      setLocalData(data);
      setDeletedRows([]);
    } finally {
      setLoading(false);
    }
  };
  //CRUD 

  const addRow = () => {
    const newRow: SupplyRows = {
      code: "",
      category: "",
      quantityItemCode: "",
      companyName: "",
      unit: "",
      unitPrice: 0,
      quantity: 0,
      contractAmount: 0,
      paidAmount: 0,
      remainingAmount: 0,
      status: "",
      description: "",
      createdBy: "",
      updatedBy: "",
      createdatetime: new Date(),
      updatedatetime: new Date(),
      isNew: true,
    };
    setLocalData((prev) => [...prev, newRow]);
  };

  const updateRow = (row: SupplyRows) => {
    setLocalData((prev) =>
      prev.map((item) => (item.code === row.code ? row : item))
    );
  };

  const deleteRows = (selected: SupplyRows[]) => {
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
        if (!projectId) return;
        await Promise.all(
          deletedRows.map((item) => deleteSupply(projectId, item.code))
        );
      }
      if (added.length > 0) {
        if (!projectId) return;
        await Promise.all(
          added.map(({ isNew, ...row }) => {
            return addSupply(token, projectId, row);
          })
        );
      }
      if (updated.length > 0) {
        if (!projectId) return;
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
