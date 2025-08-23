import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import {
  LoanPaymentRows, validateLoanPaymentRow
} from "./types";
import {
  getAllLoanPayments,
  addLoanPayments,
  updateLoanPayments,
  deleteLoanPayments,
  getLoanPaymentById,
} from "./service";
import { BaseGridHandle } from "../../../components/grid/BaseGrid";
import { getToken } from "../../../utils/token";
import { useNotifier } from "../../../hooks/useNotifier";
import { CellValueChangedEvent } from "ag-grid-community";
import { isRowModified } from "../../../types/grid/commonTypes";
import { extractApiError } from "../../../utils/axios";

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


    const getById = async (id: string) => {
      try {
        return await getLoanPaymentById(token!, id);
      } catch (err) {
        const { errorMessage } = extractApiError(err);
        notify.error(errorMessage);
        throw new Error(errorMessage);
      }
    };


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
      status: "PENDING",
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
      bank: {
        id: "",
        code: "",
        name: "",
      },
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

  const update = async (
    data: Partial<LoanPaymentRows>
  ): Promise<LoanPaymentRows> => {
    try {
      const updatedItem = await updateLoanPayments(
        token!,
        data
      );
      return updatedItem;
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

    const updateRow = (item: LoanPaymentRows) => {
      setLocalData((prev) =>
        prev.map((row) => (row.id === item.id ? item : row))
      );
    };

  const saveChanges = async () => {
    try {
      if (!hasChanges) {
        notify.error("Kaydedilecek işlem bulunamadı.");
        return;
      }
      gridRef.current?.getGridApi()?.stopEditing();

      const added = localData.filter((row) => row.isNew);
      const hasErrors = validateRows([...added]);
      if (hasErrors) return;

      notify.showLoading("Kaydediliyor...");

      if (added.length > 0) {
        const addedItems = added.map(
          ({ isNew, _originalData, ...rest }) => rest
        );
        console.log(loanId);
        await addLoanPayments(token!, addedItems, loanId);
      }

      await fetchData();
      notify.dismiss();
      notify.success("Kayıt başarılı");
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      notify.error(errorMessage);
    }
  };

  const validateRows = (rows: LoanPaymentRows[]): boolean => {
  let rowsWithErrors = 0;
  const messageCount = new Map<string, number>();

 rows.forEach((row) => {
   const errors = validateLoanPaymentRow(row); 
   if (errors.length > 0) {
     rowsWithErrors++;
     errors.forEach((msg) =>
       messageCount.set(msg, (messageCount.get(msg) ?? 0) + 1)
     );
   }
 });

 if (rowsWithErrors > 0) {
   const totalIssues = Array.from(messageCount.values()).reduce(
     (a, b) => a + b,
     0
   );

   const top3 = Array.from(messageCount.entries())
     .sort((a, b) => b[1] - a[1])
     .slice(0, 3)
     .map(([msg, cnt]) => `${msg} (${cnt})`)
     .join(" • ");

   notify.error(
     `Eksik/Geçersiz alanlar var: ${rowsWithErrors} satırda ${totalIssues} sorun. ${
       top3 ? "Özet: " + top3 : ""
     }`
   );
   return true;
 }

 return false; 
  };

  return {
    localData,
    loading,
    addRow,
    saveChanges,
    getById,
    gridRef,
    update,
    updateRow,
  };
};
