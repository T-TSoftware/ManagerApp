import { useEffect, useState } from "react";
import { SupplyRows } from "./supply.types";
import { useParams } from "react-router-dom";
import {
  getAllSupplies,
  addSupply,
  updateSupply,
  deleteSupply,
} from "./service";
import { useNotifier } from "../../hooks/useNotifier";
import { getToken } from "../../utils/token";
import { v4 as uuid } from "uuid";

export const useSupply = () => {
  const [originalData, setOriginalData] = useState<SupplyRows[]>([]);
  const [localData, setLocalData] = useState<SupplyRows[]>([]);
  const [deletedRows, setDeletedRows] = useState<SupplyRows[]>([]);
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams();
  const token = getToken();
  const notify = useNotifier();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!projectId || !token) return;
      const data = await getAllSupplies(projectId, token);
      setOriginalData(data);
      setLocalData(data);
      setDeletedRows([]);
    } finally {
      setLoading(false);
    }
  };

  const addRow = () => {
    const newRow: SupplyRows = {
      id: uuid(),
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

  const updateRow = (row: SupplyRows) => {
    setLocalData((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, ...row } : item))
    );
  };

  const deleteRows = (selected: SupplyRows[]) => {
    setLocalData((prev) =>
      prev.filter((item) => !selected.find((s) => s.id === item.id))
    );
    setDeletedRows((prev) => [...prev, ...selected]);
  };

  const saveChanges = async () => {
    try {
      const added = localData.filter((i) => i.isNew);
      const updated = localData.filter(
        (i) =>
          !i.isNew &&
          originalData.some(
            (o) => o.id === i.id && JSON.stringify(o) !== JSON.stringify(i)
          )
      );
      const deletedIds = deletedRows
        .filter((r) => r.id)
        .map((r) => r.id as string);

      const requiredFields = {
        category: "Kategori",
        quantityItemCode: "Metraj",
        companyName: "Şirket",
        unit: "Birim",
        status: "Durum",
      };

      let hasError = false;

      for (const row of added) {
        for (const [key, label] of Object.entries(requiredFields)) {
          const value = row[key as keyof SupplyRows];
          if (value === undefined || value === null || value === "") {
            notify.alert({
              id: `missing-${key}-${row.id}`,
              message: `${label} zorunludur.`,
              type: "error",
            });
            hasError = true;
          } else {
            notify.dismissAlert(`missing-${key}-${row.id}`);
          }
        }
      }
      if (hasError) return;

      if (added.length > 0) {
        console.log("added 1");
        const payload = added.map(({ id, isNew, ...rest }) => rest);
        await addSupply(token!, projectId!, payload);
        console.log("added 0");
      }
      console.log("updated:", updated);
      if (updated.length > 0) await updateSupply(token!, projectId!, updated);
      console.log("deleted:", deletedIds);
      if (deletedIds.length > 0) await deleteSupply(token!, projectId!, projectId!);
console.log("need to be fetch");
      await fetchData();
      console.log("need to be notify");
      notify.success("Kayıt başarılı.");
    } catch (err) {
      console.log("err");
      notify.handleError(err);
    }
  };
  return { localData, loading, addRow, updateRow, deleteRows, saveChanges };
};
