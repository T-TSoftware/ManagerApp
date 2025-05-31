import { useEffect, useState, useRef } from "react";
import { QuantityRows, validateQuantityRow, UpdateQuantityPayload } from "./quantity.types";
import { useParams } from "react-router-dom";
import {
  getAllQuantityByProject,
  addQuantity,
  updateQuantity,
  deleteQuantity,
} from "./service";
import { useNotifier } from "../../hooks/useNotifier";
import { getToken } from "../../utils/token";
import { v4 as uuid } from "uuid";
import { CellValueChangedEvent } from "ag-grid-community";
import { isRowModified } from "../../types/grid/commonTypes";
import { BaseGridHandle } from "../../components/grid/BaseGrid";

export const useQuantity = () => {
  const [originalData, setOriginalData] = useState<QuantityRows[]>([]);
  const [localData, setLocalData] = useState<QuantityRows[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<BaseGridHandle<QuantityRows>>(null);

  const { projectId } = useParams();
  const token = getToken();
  const notify = useNotifier();

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!projectId || !token) return;
      const data = await getAllQuantityByProject(projectId, token);
      
      const dataWithTracking = data.map(row => {
        const ensuredId = row.id || uuid();
        const rowWithId = {
          ...row,
          id: ensuredId,
          code: row.code
        };
        
        return {
          ...rowWithId,
          _originalData: { ...rowWithId }
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

  const addRow = () => {
    const currentDate = new Date();
    const rowId = uuid();
    
    const newRow: QuantityRows = {
      id: rowId,
      code: "",
      category: "",
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
      createdatetime: currentDate,
      updatedatetime: currentDate,
      isNew: true
    };
    
    const originalData = { ...newRow };
    delete (originalData as any).isNew;
    newRow._originalData = originalData;
    
    setLocalData(prev => [newRow, ...prev]);
  };

  const updateRow = (event: CellValueChangedEvent<QuantityRows>) => {
    const { data, colDef } = event;
    
    if (!data?.id || !colDef?.field) {
      notify.error("Geçersiz güncelleme: Satır kodu veya alan eksik");
      return;
    }

    const field = colDef.field as keyof QuantityRows;
    
    setLocalData(prev => 
      prev.map(item => {
        if (!item.id || item.id !== data.id) return item;
        
        let value: any = data[field];
        if ([
          'unitPrice',
          'quantity',
          'contractAmount',
          'paidAmount',
          'remainingAmount'
        ].includes(field)) {
          const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
          value = isNaN(numValue) ? 0 : numValue;
        }

        if (['createdatetime', 'updatedatetime'].includes(field)) {
          value = value ? new Date(value) : new Date();
        }

        const updatedItem = {
          ...item,
          [field]: value,
          updatedatetime: new Date()
        };

        return updatedItem;
      })
    );
  };

  const deleteRows = (selected: QuantityRows[]) => {
    const validSelectedRows = selected.filter(row => row.id);
    
    if (validSelectedRows.length !== selected.length) {
      notify.error("Bazı satırlar ID eksikliği nedeniyle silinemedi");
    }

    setLocalData(prev => {
      const deletedIds = new Set(validSelectedRows.map(row => row.id));
      return prev.filter(row => row.id && !deletedIds.has(row.id));
    });
  };

  const getModifiedFields = (current: QuantityRows, original: Partial<QuantityRows>): UpdateQuantityPayload => {
    const modifiedFields: UpdateQuantityPayload = {
      code: current.code
    };

    const fieldsToCheck = [
      'category',
      'unit',
      'unitPrice',
      'quantity',
      'contractAmount',
      'paidAmount',
      'remainingAmount',
      'status',
      'description'
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
      gridRef.current?.getGridApi()?.stopEditing();

      if (!projectId || !token) {
        notify.error("Project ID veya token eksik");
        return;
      }

      const added = localData.filter(row => row.isNew);
      const modified = localData.filter(row => !row.isNew && isRowModified(row));
      const deleted = originalData.filter(row => 
        !localData.some(localRow => localRow.id === row.id)
      );

      const hasErrors = validateRows([...added, ...modified]);
      if (hasErrors) return;

      notify.loading("Değişiklikler kaydediliyor...");

      if (added.length > 0) {
        const addedItems = added.map(({ isNew, _originalData, ...rest }) => rest);
        await addQuantity(token, projectId, addedItems);
      }

      if (modified.length > 0) {
        const payload = modified.map(row => {
          const originalRow = row._originalData;
          if (!originalRow) {
            return { code: row.code } as UpdateQuantityPayload;
          }
          return getModifiedFields(row, originalRow);
        });
        
        await updateQuantity(token, projectId, payload);
      }

      if (deleted.length > 0) {
        const codes = deleted.map(row => row.code);
        await deleteQuantity(token, projectId, codes);
      }

      await fetchData();
      notify.dismiss();
      notify.success("Kayıt başarılı");
    } catch (err) {
      console.error("Save error:", err);
      notify.handleError(err);
    }
  };

  const validateRows = (rows: QuantityRows[]): boolean => {
    let hasError = false;

    rows.forEach((row) => {
      const errors = validateQuantityRow(row);
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
