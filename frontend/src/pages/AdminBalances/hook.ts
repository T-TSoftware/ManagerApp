import { useEffect, useState, useRef } from "react";
import { BalanceRows, validateBalanceRow, UpdateBalancePayload } from "./types";
import {
  getAllBalance,
  addBalances,
  updateBalances,
  deleteBalances,
} from "./service";
import { useNotifier } from "../../hooks/useNotifier";
import { CellValueChangedEvent } from "ag-grid-community";
import { getToken } from "../../utils/token";
import { v4 as uuid } from "uuid";
import { BaseGridHandle } from "../../components/grid/BaseGrid";
import { isRowModified } from "../../types/grid/commonTypes";

export const useBalance = () => {
  const [originalData, setOriginalData] = useState<BalanceRows[]>([]);
  const [localData, setLocalData] = useState<BalanceRows[]>([]);
  const [deletedRows, setDeletedRows] = useState<BalanceRows[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<BaseGridHandle<BalanceRows>>(null);

  const token = getToken();
  const notify = useNotifier();


  const fetchData = async () => {
    setLoading(true);
    try {
      if (!token) return;
      const data = await getAllBalance(token);

      const dataWithTracking = data.map((row) => {
        const ensuredId = row.id || uuid();
        const rowWithId = {
          ...row,
          id: ensuredId,
          code: row.code,
        };

        return {
          ...rowWithId,
          _originalData: { ...rowWithId },
        };
      });

      setOriginalData(dataWithTracking);
      setLocalData(dataWithTracking);
    } catch (error) {
      notify.handleError(error);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      fetchData();
    }, [token]);

  const addRow = () => {
    const currentDate = new Date();
    const rowId = uuid();
    const newRow: BalanceRows = {
      id: rowId,
      code: "",
      name: "",
      amount: 0,
      currency: "",
      createdBy: "",
      updatedBy: "",
      createdatetime: currentDate,
      updatedatetime: currentDate,
      isNew: true,
    };

    const originalData = { ...newRow };
    delete (originalData as any).isNew;
    newRow._originalData = originalData;

    setLocalData((prev) => [newRow, ...prev]);
  };

const updateRow = (event: CellValueChangedEvent<BalanceRows>) => {
  const { data, colDef } = event;

  if (!data?.id || !colDef?.field) {
    notify.error("Geçersiz güncelleme: Satır kodu veya alan eksik");
    return;
  }

  const field = colDef.field as keyof BalanceRows;

  setLocalData((prev) =>
    prev.map((item) => {
      if (!item.id || item.id !== data.id) return item;

      let value: any = data[field];
      if (["amount"].includes(field)) {
        const numValue =
          typeof value === "string" ? parseFloat(value) : Number(value);
        value = isNaN(numValue) ? 0 : numValue;
      }

      const updatedItem = {
        ...item,
        [field]: value,
      };

      return updatedItem;
    })
  );
};

  const deleteRows = (selected: BalanceRows[]) => {
    const validSelectedRows = selected.filter(row => row.id);
    
    if (validSelectedRows.length !== selected.length) {
      notify.error("Bazı satırlar ID eksikliği nedeniyle silinemedi");
    }

    setLocalData(prev => {
      const deletedIds = new Set(validSelectedRows.map(row => row.id));
      return prev.filter(row => row.id && !deletedIds.has(row.id));
    });
  };

  const getModifiedFields = (current: BalanceRows, original: Partial<BalanceRows>): UpdateBalancePayload => {
    const modifiedFields: UpdateBalancePayload = {
      code: current.code
    };

     const fieldsToCheck = [
      'code',
      'name',
      'amount',
      'currency',
    ] as const;

    fieldsToCheck.forEach(field => {
      if (current[field] !== original[field]) {
        (modifiedFields as any)[field] = current[field];
      }
    });

    return modifiedFields;
  };


  const saveChanges = async () => {
    try {
      // Grid düzenlemeyi durdur
      gridRef.current?.getGridApi()?.stopEditing();

      const added = localData.filter((row) => row.isNew);
      const modified = localData.filter(
        (row) => !row.isNew && isRowModified(row)
      );
      const deleted = originalData.filter(
        (row) => !localData.some((localRow) => localRow.id === row.id)
      );

      const hasErrors = validateRows([...added, ...modified]);
      if (hasErrors) return;

      notify.loading("Değişiklikler kaydediliyor...");

      if (added.length > 0) {
        const addedItems = added.map(
          ({ isNew, _originalData, ...rest }) => rest
        );
        await addBalances(token!, addedItems);
      }

      if (modified.length > 0) {
        const payload = modified.map((row) => {
          const originalRow = row._originalData;
          if (!originalRow) {
            return { code: row.code } as UpdateBalancePayload;
          }
          return getModifiedFields(row, originalRow);
        });

        await updateBalances(token!, payload);
      }

      if (deleted.length > 0) {
        const codes = deleted.map((row) => row.code);
        await deleteBalances(token!, codes);
      }

      await fetchData();
      notify.dismiss();
      notify.success("Kayıt başarılı");
    } catch (err) {
      console.log("Errors:", err);
      notify.handleError(err);
    }
  };
  const validateRows = (rows: BalanceRows[]): boolean => {
    let hasError = false;

    rows.forEach((row) => {
      const errors = validateBalanceRow(row);
      if (errors.length > 0) {
        errors.forEach((error) => notify.error(error));
        hasError = true;
      }
    });

    return hasError;
  };

  return {
    localData,
    loading,
    addRow,
    updateRow,
    deleteRows,
    saveChanges,
    gridRef
  };
};
