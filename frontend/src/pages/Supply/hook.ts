import { useEffect, useState } from "react";
import { SupplyRows } from "./supply.types";
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
  const {companyId} = useApp();

     useEffect(() => {
       fetchData();
     }, []);

    //Get Data's
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!companyId) return;
        const data = await getAllSupplies(companyId);
        setOriginalData(data);
        setLocalData(data);
        setDeletedRows([]);
      } finally {
        setLoading(false);
      }
    };
    //crud 
    const addRow = () => {
      const newRow: SupplyRows = {
        code: "",
        category: "",
        quantityItem: "",
        companyName: "",
        unit: "",
        unitPrice: "",
        quantity: "",
        contractAmount: "",
        paidAmount: "",
        remainingAmount: "",
        status: "",
        description: "",
        createdBy: "",
        updatedBy: "",
        createdatetime: "",
        updatedatetime: "",
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
           if (!companyId) return;
          await Promise.all(
            deletedRows.map((item) => deleteSupply(companyId,item.code))
          );
        }
        if (added.length > 0) {
           if (!companyId) return;
          await Promise.all(
            added.map(({ isNew, ...row }) => addSupply(companyId,row))
          );
        }
        if (updated.length > 0) {
           if (!companyId) return;
          //await Promise.all(updated.map(updateSupply(companyId, updateSupply)));
        }
        await fetchData(); 
      } catch (err) {
        console.error("Save error:", err);
      }
    };

  return { localData, loading, addRow, updateRow, deleteRows, saveChanges };
};
