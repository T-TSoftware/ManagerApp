"use client";
import { useRef, useState } from "react";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";
import type { CheckFinanceRows } from "./types";
import { useCheckFinance } from "./hook";
import CheckFinanceModal from "./modal";
import Alert from "../../components/feedback/Alert";
import { FilePenLine } from "lucide-react";
import { checkStatus } from "../../constants/check/checkStatus";
import { checkTypes } from "../../constants/check/checkTypes";
import { useNotifier } from "../../hooks/useNotifier";

const CheckGrid = () => {
  const {
    localData,
    loading,
    accountOptions,
    addRow,
    updateRow,
    deleteRows,
    alert,
    setAlert,
    getById,
    create,
    update,
  } = useCheckFinance();

  const baseGridRef = useRef<BaseGridHandle<CheckFinanceRows>>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editData, setEditData] = useState<
    Partial<CheckFinanceRows> | undefined
  >();
  const notify = useNotifier();

  const colDefs: ColDef<CheckFinanceRows>[] = [
    {
      headerName: "",
      field: "edit",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<CheckFinanceRows>) => {
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
    {
      field: "transaction",
      hide: true,
    },
    { field: "code", headerName: "Kod", editable: false, minWidth: 200 },
    {
      field: "checkNo",
      headerName: "Çek Numarası",
      editable: false,
      minWidth: 200,
    },
    {
      field: "checkDate",
      headerName: "Çek Tarihi",
      type: "dateTimeColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "dueDate",
      headerName: "Son Ödeme Tarihi",
      type: "dateTimeColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "Durum",
      cellEditorParams: {
        values: checkStatus.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = checkStatus.find((c) => c.code === value);
        return item?.name ?? value;
      },
      editable: false,
      minWidth: 200,
    },
    { field: "firm", headerName: "Firma", editable: false, minWidth: 200 },
    {
      field: "bank.name",
      headerName: "Banka",
      editable: false,
      minWidth: 200,
    },
    {
      field: "type",
      headerName: "Tür",
      cellEditorParams: {
        values: checkTypes.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = checkTypes.find((c) => c.code === value);
        return item?.name ?? value;
      },
      editable: false,
      minWidth: 200,
    },
    {
      field: "remainingAmount",
      headerName: "Kalan Miktar",
      valueFormatter: (params) => Number(params.value).toLocaleString(),
      editable: false,
      minWidth: 200,
    },
    {
      field: "processedAmount",
      headerName: "İşlem Gören Miktar",
      valueFormatter: (params) => Number(params.value).toLocaleString(),
      editable: false,
      minWidth: 200,
    },
    {
      field: "amount",
      headerName: "Miktar",
      valueFormatter: (params) => Number(params.value).toLocaleString(),
      editable: false,
      minWidth: 200,
    },
    {
      field: "project.name",
      headerName: "Proje",
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
      field: "createdBy.email",
      headerName: "Oluşturan",
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
      field: "updatedBy.email",
      headerName: "Güncelleyen",
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
  ];

  const getRowId = (params: GetRowIdParams<CheckFinanceRows>) => {
    return params.data.id! || params.data.code!;
  };

  const handleModalSubmit = async (
    formData: Partial<CheckFinanceRows>
  ) => {
    if (modalMode === "create") {
      const newItem = await create(formData);
      addRow(newItem);
      notify.success("Kayıt başarıyla oluşturuldu");
    } else {
      const updatedItem = await update({ ...formData, id: editData!.id });
      updateRow(updatedItem);
       notify.success("Değişiklikler kaydedildi");
    }
  };

  return (
    <>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <CheckFinanceModal
        open={modalOpen}
        mode={modalMode}
        defaultValues={editData}
        options={accountOptions}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <BaseGrid<CheckFinanceRows>
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

export default CheckGrid;
