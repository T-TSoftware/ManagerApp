"use client";
import { useRef, useState } from "react";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";
import type { SalesRows } from "./types";
import { useSales } from "./hook";
import SalesModal from "./modal";
import Alert from "../../components/feedback/Alert";
import { FilePenLine } from "lucide-react";
import { useNotifier } from "../../hooks/useNotifier";
import { useStocks } from "../../hooks/useStocks";
import { salesStatus } from "../../constants/sales/salesStatus";
import { stockCategories } from "../../constants/stock/stockCategories";

const SalesGrid = () => {
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
  } = useSales();

  const baseGridRef = useRef<BaseGridHandle<SalesRows>>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editData, setEditData] = useState<Partial<SalesRows> | undefined>();
  const { stockOptions, loading: loadingStocks } = useStocks();
  const notify = useNotifier();

  const colDefs: ColDef<SalesRows>[] = [
    /*     {
      headerName: "",
      field: "edit",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<SalesRows>) => {
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
    }, */
    { field: "id", hide: true },
    {
      field: "companyid",
      hide: true,
    },
    {
      field: "project.name",
      hide: true,
    },
    { field: "code", headerName: "Kod", editable: false, minWidth: 200 },
    {
      field: "customerName",
      headerName: "Müşteri",
      editable: false,
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "Durum",
      cellEditorParams: {
        values: salesStatus.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = salesStatus.find((c) => c.code === value);
        return item?.name ?? value;
      },
      editable: false,
      minWidth: 200,
    },
    {
      field: "stockType",
      headerName: "Stok Tipi",
      cellEditorParams: {
        values: stockCategories.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = stockCategories.find((c) => c.code === value);
        return item?.name ?? value;
      },
      editable: false,
      minWidth: 200,
    },
    {
      field: "stock.name",
      headerName: "Stok Kodu",
      cellEditorParams: {
        values: stockOptions.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = stockOptions.find((c) => c.code === value);
        return item?.name ?? value;
      },
      editable: false,
      minWidth: 200,
    },

    {
      field: "totalAmount",
      headerName: "Toplam Ödeme",
      type: "numberColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "receivedamount",
      headerName: "Alınan Ödeme",
      type: "numberColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "remainingamount",
      headerName: "Kalan Ödeme",
      type: "numberColumn",
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

  const getRowId = (params: GetRowIdParams<SalesRows>) => {
    return params.data.id!;
  };

  const handleModalSubmit = async (formData: Partial<SalesRows>) => {
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

      <SalesModal
        open={modalOpen}
        mode={modalMode}
        defaultValues={editData}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <BaseGrid<SalesRows>
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
          add: false,
          delete: false,
          save: false,
          bar: true,
        }}
      />
    </>
  );
};

export default SalesGrid;
