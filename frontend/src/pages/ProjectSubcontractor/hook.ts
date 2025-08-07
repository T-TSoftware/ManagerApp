import { useEffect, useState, useRef, useMemo } from "react";
import {
  SubcontractorRows,
  validateSubcontractorRow,
  UpdateSubcontractorPayload,
} from "./types";
import { useParams } from "react-router-dom";
import {
  getAllSubcontractorByProject,
  addSubcontractor,
  updateSubcontractor,
  deleteSubcontractor,
} from "./service";
import { useNotifier } from "../../hooks/useNotifier";
import { getToken } from "../../utils/token";
import { v4 as uuid } from "uuid";
import { CellValueChangedEvent } from "ag-grid-community";
import { isRowModified } from "../../types/grid/commonTypes";
import { BaseGridHandle } from "../../components/grid/BaseGrid";

export const useSubcontractor = () => {
  const [originalData, setOriginalData] = useState<SubcontractorRows[]>([]);
  const [localData, setLocalData] = useState<SubcontractorRows[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<BaseGridHandle<SubcontractorRows>>(null);

  const { projectId } = useParams();
  const token = getToken();
  const notify = useNotifier();

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!projectId || !token) return;
      const data = await getAllSubcontractorByProject(projectId, token);

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
    const currentDate = new Date();
    const rowId = uuid();

    const newRow: SubcontractorRows = {
      id: rowId,
      code: "",
      category: "",
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

  const updateRow = (event: CellValueChangedEvent<SubcontractorRows>) => {
    const { data, colDef } = event;

    if (!data?.id || !colDef?.field) {
      notify.error("Geçersiz güncelleme: Satır kodu veya alan eksik");
      return;
    }

    const field = colDef.field as keyof SubcontractorRows;

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

  const deleteRows = (selected: SubcontractorRows[]) => {
    const validSelectedRows = selected.filter((row) => row.id);

    if (validSelectedRows.length !== selected.length) {
      notify.error("Bazı satırlar ID eksikliği nedeniyle silinemedi");
    }

    setLocalData((prev) => {
      const deletedIds = new Set(validSelectedRows.map((row) => row.id));
      return prev.filter((row) => row.id && !deletedIds.has(row.id));
    });
  };

  const getModifiedFields = (
    current: SubcontractorRows,
    original: Partial<SubcontractorRows>
  ): UpdateSubcontractorPayload => {
    const modifiedFields: UpdateSubcontractorPayload = {
      code: current.code,
    };

    const fieldsToCheck = [
      "category",
      "companyName",
      "unit",
      "unitPrice",
      "quantity",
      "contractAmount",
      "paidAmount",
      "remainingAmount",
      "status",
      "description",
    ] as const;

    fieldsToCheck.forEach((field) => {
      if (current[field] !== original[field]) {
        (modifiedFields as any)[field] = current[field];
      }
    });

    return modifiedFields;
  };

  const saveChanges = async () => {
    try {
      if (!hasChanges) {
        notify.error("Kaydedilecek işlem bulunamadı.");
        return;
      }
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
        await addSubcontractor(token!, projectId!, addedItems);
      }

      if (modified.length > 0) {
        const payload = modified.map((row) => {
          const originalRow = row._originalData;
          if (!originalRow) {
            return { code: row.code } as UpdateSubcontractorPayload;
          }
          return getModifiedFields(row, originalRow);
        });

        await updateSubcontractor(token!, projectId!, payload);
      }

      if (deleted.length > 0) {
        const codes = deleted.map((row) => row.code);
        await deleteSubcontractor(token!, projectId!, codes);
      }

      await fetchData();
      notify.dismiss();
      notify.success("Kayıt başarılı");
    } catch (err) {
      console.error("Save error:", err);
      notify.handleError(err);
    }
  };

  const validateRows = (rows: SubcontractorRows[]): boolean => {
    let hasError = false;

    rows.forEach((row) => {
      const errors = validateSubcontractorRow(row);
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
    gridRef,
  };
};
