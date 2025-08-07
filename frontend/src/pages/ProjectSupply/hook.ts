import { useEffect, useMemo, useRef, useState } from "react";
import { SupplyRows, validateSupplyRow, UpdateSupplyPayload } from "./types";
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
import { CellValueChangedEvent } from "ag-grid-community";
import { isRowModified } from "../../types/grid/commonTypes";
import { BaseGridHandle } from "../../components/grid/BaseGrid";

export const useSupply = () => {
  const [originalData, setOriginalData] = useState<SupplyRows[]>([]);
  const [localData, setLocalData] = useState<SupplyRows[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<BaseGridHandle<SupplyRows>>(null);

  const { projectId } = useParams();
  const token = getToken();
  const notify = useNotifier();

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!projectId || !token) return;
      const data = await getAllSupplies(projectId, token);

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
  }, [projectId, token]);

  const hasChanges = useMemo(() => {
    const added = localData.some((row) => row.isNew);
    const modified = localData.some((row) => !row.isNew && isRowModified(row));
    const deleted = originalData.some(
      (row) => !localData.some((localRow) => localRow.id === row.id)
    );
    return added || modified || deleted;
  }, [localData, originalData]);

  const addRow = () => {
    const rowId = uuid();
    const currentDate = new Date();
    const newRow: SupplyRows = {
      id: rowId,
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
      createdatetime: currentDate,
      updatedatetime: currentDate,
      isNew: true,
    };

    const originalData = { ...newRow };
    delete (originalData as any).isNew;
    newRow._originalData = originalData;

    setLocalData((prev) => [newRow, ...prev]);
  };

  const updateRow = (event: CellValueChangedEvent<SupplyRows>) => {
    const { data, colDef } = event;

    if (!data?.id || !colDef?.field) {
      notify.error("Geçersiz güncelleme: Satır kodu veya alan eksik");
      return;
    }

    const field = colDef.field as keyof SupplyRows;

    setLocalData((prev) =>
      prev.map((item) => {
        if (!item.id || item.id !== data.id) return item;

        let value: any = data[field];
        if (
          [
            "unitPrice",
            "quantity",
            "contractAmount",
            "paidAmount",
            "remainingAmount",
          ].includes(field)
        ) {
          const numValue =
            typeof value === "string" ? parseFloat(value) : Number(value);
          value = isNaN(numValue) ? 0 : numValue;
        }

        if (["createdatetime", "updatedatetime"].includes(field)) {
          value = value ? new Date(value) : new Date();
        }

        const updatedItem = {
          ...item,
          [field]: value,
          updatedatetime: new Date(),
        };

        return updatedItem;
      })
    );
  };

  const deleteRows = (selected: SupplyRows[]) => {
    const validSelectedRows = selected.filter((row) => row.id);

    if (validSelectedRows.length !== selected.length) {
      notify.error("Bazı satırlar ID eksikliği nedeniyle silinemedi.");
    }

    //const rowsToDelete = validSelectedRows.filter(row => !row.isNew);

    setLocalData((prev) => {
      const deletedIds = new Set(validSelectedRows.map((row) => row.id));
      return prev.filter((row) => row.id && !deletedIds.has(row.id));
    });
  };

  const validateRows = (rows: SupplyRows[]): boolean => {
    let hasError = false;

    rows.forEach((row) => {
      const errors = validateSupplyRow(row);
      if (errors.length > 0) {
        errors.forEach((error) => notify.error(error));
        hasError = true;
      }
    });

    return hasError;
  };

  const getModifiedFields = (
    current: SupplyRows,
    original: Partial<SupplyRows>
  ): UpdateSupplyPayload => {
    const modifiedFields: UpdateSupplyPayload = {
      code: current.code,
    };

    const fieldsToCheck: (keyof SupplyRows)[] = [
      "category",
      "quantityItemCode",
      "companyName",
      "unit",
      "unitPrice",
      "quantity",
      "contractAmount",
      "paidAmount",
      "status",
      "description",
      "code",
    ];

    fieldsToCheck.forEach((field) => {
      if (current[field] !== original[field]) {
        (modifiedFields as any)[field] = current[field];
      }
    });

    return modifiedFields;
  };

  const saveChanges = async () => {
    try {
      console.log("hasChanges", hasChanges);
      if (!hasChanges) {
        console.log("hasChanges", hasChanges);
        notify.error("Kaydedilecek işlem bulunamadı.");
        return;
      }

      gridRef.current?.getGridApi()?.stopEditing();
      
      // Yeni eklenen satırları filtrele
      const added = localData.filter((row) => row.isNew);

      // Sadece değişen satırları filtrele
      const modified = localData.filter((row) => {
        if (row.isNew) return false;
        return isRowModified(row);
      });

      // Silinen satırları bul
      const deleted = originalData.filter(
        (row) => !localData.some((localRow) => localRow.id === row.id)
      );

      const hasErrors = validateRows([...added, ...modified]);
      console.log("hasErrors", hasErrors);
      if (hasErrors) return;
      notify.loading("Değişiklikler kaydediliyor...");

      if (added.length > 0) {
        const payload = added.map(({ isNew, _originalData, ...rest }) => rest);
        await addSupply(token!, projectId!, payload);
      }

      if (modified.length > 0) {
        const payload = modified.map((row) => {
          const originalRow = row._originalData as SupplyRows;
          if (!originalRow) {
            return { code: row.code } as UpdateSupplyPayload;
          }
          return getModifiedFields(row, originalRow);
        });

        // Debug için değişen alanları logla
        console.log("Modified fields:", JSON.stringify(payload, null, 2));

        await updateSupply(token!, projectId!, payload);
      }

      if (deleted.length > 0) {
        const deletedIds = deleted.map((row) => row.id!);
        await Promise.all(
          deletedIds.map((id) => deleteSupply(token!, projectId!, id))
        );
      }

      await fetchData();
      notify.dismiss();
      notify.success("Kayıt başarılı");
    } catch (err) {
      console.log("Errors:", err);
      notify.handleError(err);
    }
  };

  return {
    localData,
    loading,
    addRow,
    updateRow,
    deleteRows,
    saveChanges,
    gridRef,
  };
};
