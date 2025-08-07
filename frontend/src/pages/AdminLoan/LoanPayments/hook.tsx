import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { LoanPaymentRows, UpdateLoanPaymentPayload, validateLoanPaymentRow } from "./types";
import {
  getAllLoanPayments,
  addLoanPayments,
  updateLoanPayments,
  deleteLoanPayments,
} from "./service";
import { BaseGridHandle } from "../../../components/grid/BaseGrid";
import { getToken } from "../../../utils/token";
import { useNotifier } from "../../../hooks/useNotifier";
import { CellValueChangedEvent } from "ag-grid-community";
import { isRowModified } from "../../../types/grid/commonTypes";


export const useLoanPaymentDetails = (loanId: string) => {
  const [originalData, setOriginalData] = useState<LoanPaymentRows[]>([]);
  const [localData, setLocalData] = useState<LoanPaymentRows[]>([]);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<BaseGridHandle<LoanPaymentRows>>(null);

  const token = getToken();
  const notify = useNotifier();

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!token) return;
      const data = await getAllLoanPayments(token!, loanId);

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
    if (loanId) fetchData();
  }, [token, loanId]);

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

    const newRow: LoanPaymentRows = {
      id: rowId,
      code: "",
      installmentNumber: 0,
      dueDate: currentDate,
      totalAmount: 0,
      interestAmount: 0,
      principalAmount: 0,
      paymentAmount: 0,
      description: "",
      remainingAmount: 0,
      status: "",
      paymentDate: currentDate,
      penaltyAmount: 0,
      loan: {
        id: "",
        code: "",
        name: "",
        project: {
          id: "",
          code: "",
          name: "",
        },
      },
      bank:{
   id: "",
          code: "",
          name: "",
  },
    createdBy:"",
  updatedBy:"",
      createdatetime: currentDate,
      updatedatetime: currentDate,
      isNew: true,
    };

    const originalData = { ...newRow };
    delete (originalData as any).isNew;
    newRow._originalData = originalData;

    setLocalData((prev) => [newRow, ...prev]);
  };

  const updateRow = (event: CellValueChangedEvent<LoanPaymentRows>) => {
    const { data, colDef } = event;

    if (!data?.id || !colDef?.field) {
      notify.error("Geçersiz güncelleme: Satır kodu veya alan eksik");
      return;
    }

    const field = colDef.field as keyof LoanPaymentRows;

    setLocalData((prev) =>
      prev.map((item) => {
        if (!item.id || item.id !== data.id) return item;

        let value: any = data[field];
        if (["quantity", "minimumQuantity"].includes(field)) {
          const numValue =
            typeof value === "string" ? parseFloat(value) : Number(value);
          value = isNaN(numValue) ? 0 : numValue;
        }

        if (["stockDate", "createdatetime", "updatedatetime"].includes(field)) {
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

  const deleteRows = (selected: LoanPaymentRows[]) => {
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
    current: LoanPaymentRows,
    original: Partial<LoanPaymentRows>
  ): UpdateLoanPaymentPayload => {
    const modifiedFields: UpdateLoanPaymentPayload = {
      code: current.code,
    };

    const fieldsToCheck = [
      "dueDate",
      "totalAmount",
      "interestAmount",
      "description",
      "penaltyAmount",
      "paymentDate",
      "loan",
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

      notify.showLoading("Kaydediliyor...");

      if (added.length > 0) {
        const addedItems = added.map(
          ({ isNew, _originalData, ...rest }) => rest
        );
           console.log(loanId);
        await addLoanPayments(token!, addedItems, loanId);
      }

      if (modified.length > 0) {
        const payload = modified.map((row) => {
          const originalRow = row._originalData;
          if (!originalRow) {
            return { code: row.code } as UpdateLoanPaymentPayload;
          }
          return getModifiedFields(row, originalRow);
        });

        await updateLoanPayments(token!, payload, loanId);
      }

      if (deleted.length > 0) {
        const codes = deleted.map((row) => row.code);
        await deleteLoanPayments(token!, codes);
      }

      await fetchData();
      notify.dismiss();
      notify.success("Kayıt başarılı");
    } catch (err) {
      notify.handleError(err);
    }
  };

  const validateRows = (rows: LoanPaymentRows[]): boolean => {
    let hasError = false;

    rows.forEach((row) => {
      const errors = validateLoanPaymentRow(row);
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
