"use client";
import { useRef, useState } from "react";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";
import type { FinanceTransactionRows } from "./types";
import { useFinance } from "./hook";
import FinanceTransactionModal from "./modal";
import Alert from "../../components/feedback/Alert";
import { currencyList } from "../../constants/currencyList";
import { financeTypes } from "../../constants/financeTypes";
import { financeCategory } from "../../constants/financeCategory";
import { FilePenLine } from "lucide-react";
import { paymentMethods } from "../../constants/paymentMethods";
import { yesNo } from "../../constants/yesNo";

const FinanceGrid = () => {
  const {
    localData,
    loading,
    accountOptions,
    addRow,
    updateRow,
    deleteRows,
    saveChanges,
    alert,
    setAlert,
    getById,
    create,
    update,
  } = useFinance();

  const baseGridRef = useRef<BaseGridHandle<FinanceTransactionRows>>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editData, setEditData] = useState<Partial<FinanceTransactionRows> | undefined>();

  const colDefs: ColDef<FinanceTransactionRows>[] = [
    {
      headerName: "",
      field: "edit",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<FinanceTransactionRows>) => {
        return (
          <button
            className="text-black hover:underline text-sm"
            onClick={async () => {
              if (!params.data?.id) return;
              const record = await getById(params.data.id);
              if (record) {
                setEditData(record);
                setModalMode("edit");
                setModalOpen(true);
              }
            }}
          >
            <FilePenLine
              aria-hidden="true"
              className="-mr-1 size-5 text-gray-500 dark:text-white"
            />
          </button>
        );
      },
    },
    { field: "id", hide: true },
    { field: "code", headerName: "Kod", editable: false, minWidth: 200 },
    {
      field: "type",
      headerName: "Tür",
      editable: false,
      minWidth: 200,
      cellEditorParams: {
        values: financeTypes.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = financeTypes.find((c) => c.code === value);
        return item?.name ?? value;
      },
    },
    {
      field: "project",
      headerName: "Proje",
      editable: false,
      minWidth: 200,
    },
    {
      field: "fromAccount.name",
      headerName: "Kaynak Hesap",
      valueGetter: ({ data }) => data?.fromAccount?.name ?? "-",
      editable: false,
      minWidth: 200,
    },
    {
      field: "toAccount.name",
      headerName: "Hedef Hesap",
      valueGetter: ({ data }) => data?.toAccount?.name ?? "-",
      editable: false,
      minWidth: 200,
    },
    { field: "amount", headerName: "Tutar", editable: false, minWidth: 200 },
    {
      field: "currency",
      headerName: "Para Birimi",
      editable: false,
      minWidth: 200,
      cellEditorParams: {
        values: currencyList.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = currencyList.find((c) => c.code === value);
        return item?.name ?? value;
      },
    },
    { field: "source", headerName: "Kaynak", editable: false, minWidth: 200 },
    {
      field: "targetType",
      hide: true,
    },
    {
      field: "targetId",
      hide: true,
    },
    {
      field: "targetName",
      headerName: "Hedef Adı",
      editable: false,
      minWidth: 200,
    },
    {
      field: "transactionDate",
      headerName: "İşlem Tarihi",
      type: "dateTimeColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "method",
      headerName: "Yöntem",
      editable: false,
      minWidth: 200,
      cellEditorParams: {
        values: paymentMethods.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = paymentMethods.find((c) => c.code === value);
        return item?.name ?? value;
      },
    },
    {
      field: "category",
      headerName: "Kategori",
      cellEditorParams: {
        values: financeCategory.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = financeCategory.find((c) => c.code === value);
        return item?.name ?? value;
      },
      editable: false,
      minWidth: 200,
    },
    {
      field: "invoiceYN",
      headerName: "Faturalı mı?",
      cellEditorParams: {
        values: yesNo.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = yesNo.find((c) => c.code === value);
        return item?.name ?? value;
      },
      editable: false,
      minWidth: 200,
    },
    {
      field: "invoiceCode",
      headerName: "Fatura Kodu",
      editable: false,
      minWidth: 200,
    },
    {
      field: "checkCode",
      headerName: "Çek Kodu",
      editable: false,
      minWidth: 200,
    },
    {
      field: "checkstatus",
      headerName: "Çek Durumu",
      editable: false,
      minWidth: 200,
    },
    {
      field: "loanCode",
      headerName: "Kredi Kodu",
      editable: false,
      minWidth: 200,
    },
    {
      field: "loanStatus",
      headerName: "Kredi Durumu",
      editable: false,
      minWidth: 200,
    },
    {
      field: "description",
      headerName: "Açıklama",
      editable: false,
      minWidth: 200,
    },
    {
      field: "createdatetime",
      headerName: "Oluşturulma Tarihi",
      type: "dateTimeColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "updatedatetime",
      headerName: "Güncellenme Tarihi",
      type: "dateTimeColumn",
      editable: false,
      minWidth: 200,
    },
    // {
    //   field: "createdby",
    //   headerName: "Oluşturan",
    //   editable: false,
    //   minWidth: 200,
    // },
    {
      field: "updatedBy.name",
      headerName: "Güncelleyen",
      editable: false,
      minWidth: 200,
    },
  ];

  const getRowId = (params: GetRowIdParams<FinanceTransactionRows>) => {
    return params.data.id!;
  };

const handleModalSubmit = async (formData: Partial<FinanceTransactionRows>) => {
  if (modalMode === "create") {
    const newItem = await create(formData);
    addRow(newItem);
  } else {
    const updatedItem = await update(formData);
    updateRow(updatedItem);
  }
};


  return (
    <>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <FinanceTransactionModal
        open={modalOpen}
        mode={modalMode}
        defaultValues={editData}
        options={accountOptions}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <BaseGrid<FinanceTransactionRows>
        ref={baseGridRef}
        rowData={localData}
        columnDefs={colDefs}
        getRowId={getRowId}
        onOpenCreateModal={() => {
          setModalMode("create");
          setEditData(undefined);
          setModalOpen(true);
        }}
        enableSelection={false}
        onDeleteRow={deleteRows}
        onSaveChanges={saveChanges}
        isLoading={loading}
        showButtons={{
          refresh: true,
          add: true,
          delete: false,
          save: false,
          bar: true,
        }}
      />
    </>
  );
};

export default FinanceGrid;
