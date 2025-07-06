"use client";
import { useRef, useState } from "react";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  CellValueChangedEvent,
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";
import type { SupplierListRows } from "./types";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { useSupplierList } from "./hook";
import SupplierListModal from "./modal";
import Alert from "../../components/feedback/Alert";

const SupplierListGrid = () => {
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
  } = useSupplierList();

  const baseGridRef = useRef<BaseGridHandle<SupplierListRows>>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editData, setEditData] = useState<
    Partial<SupplierListRows> | undefined
  >();

  const colDefs: ColDef<SupplierListRows>[] = [
    {
      headerName: "",
      field: "edit",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<SupplierListRows>) => {
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
    { field: "name", headerName: "Ad", editable: false, minWidth: 200 },
    { field: "site", headerName: "Adres", editable: false, minWidth: 200 },
    { field: "status", headerName: "Durum", editable: false, minWidth: 200 },
    {
      field: "estimatedStartDate",
      headerName: "Beklenen Başlama Tarihi",
      type: "dateTimeColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "actualStartDate",
      headerName: "Gerçek Başlama Tarihi",
      type: "dateTimeColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "estimatedEndDate",
      headerName: "Beklenen Bitiş Tarihi",
      type: "dateTimeColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "actualEndDate",
      headerName: "Gerçek Bitiş Tarihi",
      type: "dateTimeColumn",
      editable: false,
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
      type: "dateTimeColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "updatedatetime",
      headerName: "Güncelleme Tarihi",
      type: "dateTimeColumn",
      editable: false,
      minWidth: 200,
    },
  ];

  const getRowId = (params: GetRowIdParams<SupplierListRows>) => {
    return params.data.id!;
  };

  const handleCellChange = (
    e: CellValueChangedEvent<SupplierListRows>
  ) => {
    updateRow({ ...e.data });
  };

  const handleModalSubmit = async (
    formData: Partial<SupplierListRows>
  ) => {
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

      <SupplierListModal
        open={modalOpen}
        mode={modalMode}
        defaultValues={editData}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <BaseGrid<SupplierListRows>
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

export default SupplierListGrid;
