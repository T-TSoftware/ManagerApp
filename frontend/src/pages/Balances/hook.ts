import { useEffect, useState } from "react";
import { BalanceRows } from "./types";
import { useParams } from "react-router-dom";
import {
  getAllBalance,
  addBalance,
  updateBalance,
  deleteBalance,
} from "./service";
import { getToken } from "../../utils/token";
import { AlertProps } from "../../components/ui/Alert";

export const useBalance = () => {
  const [originalData, setOriginalData] = useState<BalanceRows[]>([]);
  const [localData, setLocalData] = useState<BalanceRows[]>([]);
  const [deletedRows, setDeletedRows] = useState<BalanceRows[]>([]);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [loading, setLoading] = useState(true);
  const token = getToken();

  useEffect(() => {
    fetchData();
  }, []);

  //Get Data's

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!token) return;
      const data = await getAllBalance(token);
      setOriginalData(data);
      setLocalData(data);
      setDeletedRows([]);
    } finally {
      setLoading(false);
    }
  };
  //CRUD

  const addRow = () => {
    const newRow: BalanceRows = {
      code: "",
      name: "",
      amount: 0.0,
      currency: "TRY",
      isNew: true,
    };
    setLocalData((prev) => [newRow, ...prev]);
  };

  const updateRow = (row: BalanceRows) => {
    setLocalData((prev) =>
      prev.map((item) => (item.code === row.code ? { ...item, ...row } : item))
    );
  };

  const deleteRows = (selected: BalanceRows[]) => {
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
            orig.id === item.id && JSON.stringify(orig) !== JSON.stringify(item)
        )
    );
    console.log("Gönderilecek veri:", updated);
    try {
      if (deletedRows.length > 0) {
        if (!token) return;
        await Promise.all(
          deletedRows.map((item) => deleteBalance(item.id || ""))
        );
      }
      if (added.length > 0) {
        if (!token) return;
        await Promise.all(
          added.map(({ isNew, ...row }) => {
            return addBalance(token, row);
          })
        );
      }
      if (updated.length > 0) {
        if (!token) return;
        await Promise.all(updated.map((row) => updateBalance(token, row)));
      }
      await fetchData();
    } catch (err) {
      setAlert({
        title: "Hata!",
        message: "Yetkisiz Erişim!",
        type: "error",
        autoClose: true,
      });
      console.error("Save error:", err);
    }
  };

  return {
    localData,
    loading,
    addRow,
    updateRow,
    deleteRows,
    saveChanges,
    alert,
    setAlert,
  };
};
