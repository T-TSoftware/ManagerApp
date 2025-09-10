// hook.ts
import { useEffect, useMemo, useRef, useState } from "react";
import type { CellValueChangedEvent } from "ag-grid-community";
import { v4 as uuid } from "uuid";

import type {
  BalanceRows,
  NewBalancePayload,
  UpdateBalancePayload,
} from "./types";
import { validateBalanceRow } from "./types";
import { isRowModified } from "../../types/grid/commonTypes";

import {
  getAllBalance,
  addBalances,
  updateBalances,
  deleteBalances,
} from "./service";

import { getToken } from "../../utils/token";
import { BaseGridHandle } from "../../components/grid/BaseGrid";
import { useNotifier } from "../../hooks/useNotifier";
import { extractApiError } from "../../utils/axios";

export const useBalance = () => {
  // UI state
  const [localData, setLocalData] = useState<BalanceRows[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const gridRef = useRef<BaseGridHandle<BalanceRows>>(null);

  // services/helpers
  const notify = useNotifier();
  const token = getToken();

  // immutable snapshot (silinenleri & diff’i saptamak için)
  const [originalData, setOriginalData] = useState<BalanceRows[]>([]);

  /** Server’dan veri çek */
  const fetchData = async () => {
    try {
      setLoading(true);
      const rows = await getAllBalance(token!);

      // diff için _originalData ekle
      const withSnapshot = rows.map((r) => ({
        ...r,
        _originalData: { ...r },
      }));

      setLocalData(withSnapshot);
      setOriginalData(rows);
    } catch (err) {
      notify.handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /** Grid’e yeni satır ekle (client-side) */
  const addRow = () => {
    const now = new Date();
    const id = uuid();

    const newRow: BalanceRows = {
      id,
      code: "", 
      name: "",
      amount: 0,
      currency: "",
      createdBy: "",
      updatedBy: "",
      createdatetime: now,
      updatedatetime: now,
      isNew: true,
      _originalData: undefined,
    };

    setLocalData((prev) => [newRow, ...prev]);
  };

  /** Hücre değişikliğini local state’e uygula */
  const updateRow = (e: CellValueChangedEvent<BalanceRows>) => {
    const { data, colDef, newValue } = e;
    if (!data || !colDef?.field) return;

    setLocalData((prev) =>
      prev.map((row) =>
        row.id === data.id
          ? {
              ...row,
              [colDef.field as keyof BalanceRows]: newValue,
            }
          : row
      )
    );
  };


  const deleteRows = async (ids: string[]) => {
    try {
      if (!ids.length) return;

      const toDelete = localData.filter((r) => ids.includes(r.id ?? ""));
      if (!toDelete.length) return;

      notify.showLoading("Siliniyor...");
      const codes = toDelete.map((r) => r.code);
      await deleteBalances(token!, codes);

      await fetchData();
      notify.success("Silme işlemi başarılı");
    } catch (err) {
      notify.handleError(err);
    } finally {
      notify.dismiss();
    }
  };


  const validateRows = (rows: BalanceRows[]): boolean => {
    let errorCount = 0;
    const grouped = new Map<string, number>();

    rows.forEach((row) => {
      const messages = validateBalanceRow(row);
      if (messages.length > 0) {
        errorCount += messages.length;
        messages.forEach((m) => grouped.set(m, (grouped.get(m) ?? 0) + 1));
      }
    });

    if (errorCount > 0) {
      const top3 = Array.from(grouped.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([msg, cnt]) => `${msg} (${cnt}x)`)
        .join(" | ");

      notify.error(
        `Toplam ${errorCount} doğrulama hatası. ${top3 ? "Özet: " + top3 : ""}`
      );
      return true; 
    }
    return false;
  };


const saveChanges = async () => {
  gridRef.current?.getGridApi()?.stopEditing();

  const added = localData.filter((r) => r.isNew);
  const modified = localData.filter((r) => !r.isNew && isRowModified(r));
  const deleted = originalData.filter(
    (orig) => !localData.some((loc) => loc.id === orig.id)
  );

  const hasOps = added.length + modified.length + deleted.length > 0;
  if (!hasOps) {
    notify.error("Kaydedilecek işlem bulunamadı.");
    return;
  }

  if (validateRows([...added, ...modified])) return;

  try {
    notify.showLoading("Kaydediliyor...");

    if (added.length > 0) {
      const addPayload: NewBalancePayload[] = added.map(
        ({ name, currency, amount }) => ({
          name,
          currency,
          amount,
        })
      );
      await addBalances(token!, addPayload);
    }

    if (modified.length > 0) {
      const updatePayload: UpdateBalancePayload[] = modified.map((r) => ({
        id: r.id!,
        name: r.name,
        currency: r.currency,
        amount: r.amount,
      }));
      await updateBalances(token!, updatePayload);
    }

    if (deleted.length > 0) {
      const codes = deleted.map((r) => r.code);
      await deleteBalances(token!, codes);
    }

    await fetchData();

    // ✅ Başarı: önce loading’i kapat, sonra başarı toast
    notify.dismiss();
    notify.success("Kayıt başarılı");
  } catch (error) {
    const { errorMessage } = extractApiError(error);

    // ✅ Hata: önce loading’i kapat, sonra error toast (kapatma yok)
    notify.dismiss();
    notify.error(errorMessage);
  }
  // ❌ finally’de dismiss YOK — error’u hemen kapatıyordu
};

  const hasChanges = useMemo(() => {
    if (localData.some((r) => r.isNew)) return true;
    if (originalData.length !== localData.length) return true; // ekleme/silme
    return localData.some((r) => !r.isNew && isRowModified(r));
  }, [localData, originalData]);

  return {
    localData,
    loading,
    addRow,
    updateRow,
    deleteRows,
    saveChanges,
    gridRef,
    hasChanges,
    fetchData,
  };
};
