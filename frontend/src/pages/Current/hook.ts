import { useEffect, useState, useRef } from "react";
import { CurrentRows, validateCurrentRow } from "./current.types";
import { useParams } from "react-router-dom";
import {
  getAllCurrents,
  addCurrent,
  updateCurrent,
  deleteCurrent,
} from "./service";
import { useNotifier } from "../../hooks/useNotifier";
import { getToken } from "../../utils/token";
import { v4 as uuid } from "uuid";
import { CellValueChangedEvent } from "ag-grid-community";
import { isRowModified } from "../../types/grid/commonTypes";
import { BaseGridHandle } from "../../components/grid/BaseGrid";

export const useCurrent = () => {
  const [originalData, setOriginalData] = useState<CurrentRows[]>([]);
  const [localData, setLocalData] = useState<CurrentRows[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<BaseGridHandle<CurrentRows>>(null);

  const { projectId } = useParams();
  const token = getToken();
  const notify = useNotifier();

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!projectId || !token) return;
      const data = await getAllCurrents(projectId, token);
      
      const dataWithTracking = data.map(row => ({
        ...row,
        _originalData: { ...row }
      }));
      
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
    const newRow: CurrentRows = {
      id: uuid(),
      balanceCode: "",
      type: "",
      amount: "",
      currency: "",
      description: "",
      transactionDate: currentDate,
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

  const updateRow = (event: CellValueChangedEvent<CurrentRows>) => {
    const { data, colDef } = event;
    
    if (!data?.id || !colDef?.field) {
      notify.error("Geçersiz güncelleme: Satır kodu veya alan eksik");
      return;
    }

    const field = colDef.field as keyof CurrentRows;
    
    setLocalData(prev => 
      prev.map(item => {
        if (item.id !== data.id) return item;
        
        let value: any = data[field];
        if (field === 'amount') {
          const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
          value = isNaN(numValue) ? 0 : numValue;
        }

        if (['transactionDate', 'createdatetime', 'updatedatetime'].includes(field)) {
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

  const deleteRows = (selected: CurrentRows[]) => {
    const validSelectedRows = selected.filter(row => row.id);
    
    if (validSelectedRows.length !== selected.length) {
      notify.error("Bazı satırlar ID eksikliği nedeniyle silinemedi");
    }

    setLocalData(prev => {
      const deletedIds = new Set(validSelectedRows.map(row => row.id));
      return prev.filter(row => !deletedIds.has(row.id));
    });
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
        await Promise.all(
          added.map(({ isNew, _originalData, ...row }) => {
            return addCurrent(token, projectId, row);
          })
        );
      }

      if (modified.length > 0) {
        await Promise.all(
          modified.map(row => updateCurrent(token, projectId, row))
        );
      }

      if (deleted.length > 0) {
        await Promise.all(
          deleted.map(row => deleteCurrent(projectId, row.id))
        );
      }

      await fetchData();
      notify.dismiss();
      notify.success("Kayıt başarılı");
    } catch (err) {
      console.error("Save error:", err);
      notify.handleError(err);
    }
  };

  const validateRows = (rows: CurrentRows[]): boolean => {
    let hasError = false;

    rows.forEach((row) => {
      const errors = validateCurrentRow(row);
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
