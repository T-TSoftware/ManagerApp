"use client";
import { useRef, useState } from "react";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";
import type { FinanceTransactionRows } from "./types";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { useFinance } from "./hook";
import FinanceTransactionModal from "./modal";
import Alert from "../../components/feedback/Alert";
import { currencyList } from "../../constants/currencyList";
import { financeTypes } from "../../constants/financeTypes";
import { financeCategory } from "../../constants/financeCategory";

const FinanceGrid = () => {
  const {
    localData,
    loading,
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
            <PencilSquareIcon
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
      field: "fromAccount",
      headerName: "Kaynak Hesap",
      valueGetter: ({ data }) => data?.fromAccount?.code ?? "-",
      editable: false,
      minWidth: 200,
    },
    {
      field: "toAccount",
      headerName: "Hedef Hesap",
      valueGetter: ({ data }) => data?.toAccount?.code ?? "-",
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
      field: "targettype",
      hide: true,
    },
    {
      field: "targetid",
      hide: true,
    },
    {
      field: "targetname",
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
    { field: "method", headerName: "Yöntem", editable: false, minWidth: 200 },
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
      field: "invoiceyn",
      headerName: "Fatura",
      editable: false,
      minWidth: 200,
    },
    {
      field: "invoicecode",
      headerName: "Fatura Kodu",
      editable: false,
      minWidth: 200,
    },
    {
      field: "checkcode",
      headerName: "Çek Kodu",
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
      field: "updatedby",
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
