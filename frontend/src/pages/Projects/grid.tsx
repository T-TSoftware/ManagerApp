"use client";
import { useRef, useState } from "react";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  CellValueChangedEvent,
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";
import type { ProjectRows } from "./types";
import { useProject } from "./hook";
import ProjectModal from "./modal";
import Alert from "../../components/ui/Alert";

const ProjectGrid = () => {
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
  } = useProject();

  const baseGridRef = useRef<BaseGridHandle<ProjectRows>>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editData, setEditData] = useState<Partial<ProjectRows> | undefined>();

  const colDefs: ColDef<ProjectRows>[] = [
    {
      headerName: "",
      field: "edit",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      cellRenderer: (params: ICellRendererParams<ProjectRows>) => {
        return (
          <button
            className="text-blue-600 hover:underline text-sm"
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
            ✏️
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

  const getRowId = (params: GetRowIdParams<ProjectRows>) => {
    return params.data.id!;
  };

  const handleCellChange = (e: CellValueChangedEvent<ProjectRows>) => {
    updateRow({ ...e.data });
  };

  const handleModalSubmit = async (formData: Partial<ProjectRows>) => {
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
      {/* {alert && <Alert {...alert} onClose={() => setAlert(null)} />} */}

      <ProjectModal
        open={modalOpen}
        mode={modalMode}
        defaultValues={editData}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <BaseGrid<ProjectRows>
        ref={baseGridRef}
        rowData={localData}
        columnDefs={colDefs}
        getRowId={getRowId}
        onOpenCreateModal={() => {
          setModalMode("create");
          setEditData(undefined);
          setModalOpen(true);
        }}
        onDeleteRow={deleteRows}
        onSaveChanges={saveChanges}
        onCellValueChanged={handleCellChange}
        isLoading={loading}
        showButtons={{
          refresh: true,
          add: true,
          delete: true,
          save: true,
          bar: true,
        }}
      />
    </>
  );
};

export default ProjectGrid;
