"use client";
import { useRef, useState } from "react";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";
import type { AnnualLeavesRows } from "./types";
import { FilePenLine } from "lucide-react";
import { useAnnualLeave } from "./hook";
import AnnualLeaveModal from "./modal";
import Alert from "../../components/feedback/Alert";

const AnnualLeaveGrid = () => {
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
  } = useAnnualLeave();

  const baseGridRef = useRef<BaseGridHandle<AnnualLeavesRows>>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editData, setEditData] = useState<
    Partial<AnnualLeavesRows> | undefined
  >();

  const colDefs: ColDef<AnnualLeavesRows>[] = [
    {
      headerName: "",
      field: "edit",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<AnnualLeavesRows>) => {
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

  const getRowId = (params: GetRowIdParams<AnnualLeavesRows>) => {
    return params.data.id!;
  };

  const handleModalSubmit = async (formData: Partial<AnnualLeavesRows>) => {
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

      <AnnualLeaveModal
        open={modalOpen}
        mode={modalMode}
        defaultValues={editData}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <BaseGrid<AnnualLeavesRows>
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

export default AnnualLeaveGrid;
