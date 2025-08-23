"use client";
import { useRef, useState } from "react";
import { useStock } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";

import type { StockRows } from "./types";
import { useNotifier } from "../../hooks/useNotifier";
import { FilePenLine } from "lucide-react";
import StockModal from "./modal";
import Alert from "../../components/feedback/Alert";
import { stockCategories } from "../../constants/stock/stockCategories";
import { units } from "../../constants/stock/units";


const StockGrid = () => {
  const {
    localData,
    loading,
    addRow,
    updateRow,
    deleteRows,
    alert,
    setAlert,
    getById,
    create,
    update,
  } = useStock();
  const baseGridRef = useRef<BaseGridHandle<StockRows>>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editData, setEditData] = useState<
    Partial<StockRows> | undefined
  >();
  const notify = useNotifier();
  
  const colDefs: ColDef<StockRows>[] = [
    {
      headerName: "",
      field: "edit",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<StockRows>) => {
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
    {
      field: "id",
      hide: true,
    },
    {
      field: "code",
      headerName: "Kod",
      editable: false,
      minWidth: 200,
    },
    {
      field: "name",
      headerName: "İsim",
      editable: false,
      minWidth: 300,
    },
    {
      field: "category",
      headerName: "Kategori",
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
      field: "unit",
      headerName: "Birim",
      cellEditorParams: {
        values: units.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = units.find((c) => c.code === value);
        return item?.name ?? value;
      },
      editable: false,
      minWidth: 200,
    },
    {
      field: "quantity",
      headerName: "Miktar",
      editable: false,
      minWidth: 200,
      type: "numberColumn",
    },
    {
      field: "minimumQuantity",
      headerName: "Minimum Miktar",
      editable: false,
      minWidth: 200,
      type: "numberColumn",
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
      field: "location",
      headerName: "Konum",
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
      headerName: "Güncelleme Tarihi",
      editable: false,
      minWidth: 200,
    },
  ];

  const getRowId = (params: GetRowIdParams<StockRows>) => {
    return params.data.id! || params.data.code!;
  };

    const handleModalSubmit = async (formData: Partial<StockRows>) => {
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

      <StockModal
        open={modalOpen}
        mode={modalMode}
        defaultValues={editData}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <BaseGrid<StockRows>
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

export default StockGrid;
