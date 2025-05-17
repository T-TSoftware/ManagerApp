import { useEffect, useState } from "react";
import { BalanceRows } from "./types";
import {
  getAllBalance,
  addBalances,
  updateBalances,
  deleteBalances,
} from "./service";
import { getToken } from "../../utils/token";
import { v4 as uuid } from "uuid";

export const useBalance = () => {
  const [originalData, setOriginalData] = useState<BalanceRows[]>([]);
  const [localData, setLocalData] = useState<BalanceRows[]>([]);
  const [deletedRows, setDeletedRows] = useState<BalanceRows[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<any>(null);
  const token = getToken();

  useEffect(() => {
    fetchData();
  }, []);

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

  const addRow = () => {
    const newRow: BalanceRows = {
      id: uuid(),
      code: "",
      name: "",
      amount: 0,
      currency: "",
      isNew: true,
    };
    setLocalData((prev) => [newRow, ...prev]);
  };

  const updateRow = (row: BalanceRows) => {
    setLocalData((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, ...row } : item))
    );
  };

  const deleteRows = (selected: BalanceRows[]) => {
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

      if (added.length > 0)
        await addBalances(
          token!,
          added.map(({ isNew, ...r }) => r)
        );
      if (updated.length > 0) await updateBalances(token!, updated);
      if (deletedIds.length > 0) await deleteBalances(token!, deletedIds);

      await fetchData();
    } catch (err) {
      setAlert({
        title: "Hata",
        message: "Kayıt işlemi sırasında bir hata oluştu",
        type: "error",
      });
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
