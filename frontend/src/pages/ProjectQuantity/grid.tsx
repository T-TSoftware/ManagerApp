"use client";
import { useQuantity } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";
import type { QuantityRows } from "./types";
import { units } from "../../constants/stock/units";
import { stockCategories } from "../../constants/stock/stockCategories";
import { useRef, useState } from "react";
import { useNotifier } from "../../hooks/useNotifier";
import { FilePenLine } from "lucide-react";
import QuantityItemModal from "./modal";
import Alert from "../../components/feedback/Alert";

const QuantityGrid = () => {
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
    update,} =
    useQuantity();

    const baseGridRef = useRef<BaseGridHandle<QuantityRows>>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [editData, setEditData] = useState<
      Partial<QuantityRows> | undefined
    >();
    const notify = useNotifier();

  const colDefs: ColDef<QuantityRows>[] = [
    {
      headerName: "",
      field: "edit",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<QuantityRows>) => {
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
      headerName: "ID",
      hide: true,
    },
    {
      field: "code",
      headerName: "Kod",
      editable: false,
      minWidth: 200,
    },
    {
      field: "category",
      headerName: "Kategori",
      editable: true,
      minWidth: 200,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: stockCategories.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = stockCategories.find((c) => c.code === value);
        return item?.name ?? value;
      },
    },
    {
      field: "unit",
      headerName: "Birim",
      editable: true,
      minWidth: 200,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: units.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = units.find((c) => c.code === value);
        return item?.name ?? value;
      },
    },
    {
      field: "quantity",
      headerName: "Miktar",
      editable: true,
      minWidth: 200,
      type: "numberColumn",
    },
    {
      field: "description",
      headerName: "Açıklama",
      editable: true,
      minWidth: 200,
    },
    {
      field: "createdBy",
      headerName: "Oluşturan Kişi",
      editable: false,
      minWidth: 200,
    },
    {
      field: "updatedBy",
      headerName: "Güncelleyen Kişi",
      editable: false,
      minWidth: 200,
    },
    {
      field: "createdatetime",
      headerName: "Oluşturulma Tarihi",
      editable: false,
      minWidth: 200,
      type: "dateTimeColumn",
    },
    {
      field: "updatedatetime",
      headerName: "Güncelleme Tarihi",
      editable: false,
      minWidth: 200,
      type: "dateTimeColumn",
    },
  ];

const getRowId = (params: GetRowIdParams<QuantityRows>) => {
  return params.data.id!;
};

const handleModalSubmit = async (formData: Partial<QuantityRows>) => {
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

      <QuantityItemModal
        open={modalOpen}
        mode={modalMode}
        defaultValues={editData}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
      <BaseGrid<QuantityRows>
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

export default QuantityGrid;
