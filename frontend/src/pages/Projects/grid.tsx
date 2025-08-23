"use client";
import { useRef, useState } from "react";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";
import type { ProjectRows } from "./types";
import { FilePenLine } from "lucide-react";
import { useProject } from "./hook";
import ProjectModal from "./modal";
import Alert from "../../components/feedback/Alert";
import { projectStatus } from "../../constants/project/projectStatus";
import { useNotifier } from "../../hooks/useNotifier";

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
  const notify = useNotifier();
  const colDefs: ColDef<ProjectRows>[] = [
    /*     {
      headerName: "",
      field: "edit",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<ProjectRows>) => {
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
    { field: "code", headerName: "Kod", editable: false, minWidth: 200 },
    { field: "name", headerName: "Ad", editable: false, minWidth: 200 },
    { field: "site", headerName: "Adres", editable: false, minWidth: 200 },
    {
      field: "status",
      headerName: "Durum",
      cellEditorParams: {
        values: projectStatus.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = projectStatus.find((c) => c.code === value);
        return item?.name ?? value;
      },
      editable: false,
      minWidth: 200,
    },
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
      field: "createdBy.email",
      headerName: "Oluşturan Kişi",
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
      headerName: "Güncelleyen Kişi",
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

const handleModalSubmit = async (formData: Partial<ProjectRows>) => {
  if (modalMode === "create") {
    const newItem = await create(formData);
    addRow(newItem);
    notify.success("Kayıt başarıyla eklendi.")
  } else {
    const updatedItem = await update(formData); 
    updateRow(updatedItem); 
    notify.success("Değişiklikler kaydedildi.");
  }
};


  return (
    <>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

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

export default ProjectGrid;
