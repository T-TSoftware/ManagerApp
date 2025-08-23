"use client";
import { useRef, useState } from "react";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";
import type { EmployeesRows } from "./types";
import { FilePenLine } from "lucide-react";
import { useEmployees } from "./hook";
import EmployeesModal from "./modal";
import Alert from "../../components/feedback/Alert";
import { useParams } from "react-router-dom";
import { useNotifier } from "../../hooks/useNotifier";

const EmployeesGrid = () => {
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
  } = useEmployees();

  const baseGridRef = useRef<BaseGridHandle<EmployeesRows>>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editData, setEditData] = useState<
    Partial<EmployeesRows> | undefined
  >();
  const notify = useNotifier();

  const colDefs: ColDef<EmployeesRows>[] = [
    {
      headerName: "",
      field: "edit",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<EmployeesRows>) => {
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
    { field: "code", hide: true },

    {
      field: "firstName",
      headerName: "Ad",
      editable: false,
      minWidth: 200,
    },
    {
      field: "lastName",
      headerName: "Soyad",
      editable: false,
      minWidth: 200,
    },
    {
      field: "age",
      headerName: "Yaş",
      editable: false,
      minWidth: 200,
    },
    {
      field: "netSalary",
      headerName: "Net Maaş",
      type: "numberColumn",
      editable: false,
      minWidth: 200,
    },

    {
      field: "grossSalary",
      headerName: "Brüt Maaş",
      type: "numberColumn",
      editable: false,
      minWidth: 200,
    },

    {
      field: "position",
      headerName: "Pozisyon",
      editable: false,
      minWidth: 200,
    },
    {
      field: "startDate",
      headerName: "Başlangıç Tarihi",
      type: "dateTimeColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "department",
      headerName: "Departman",
      editable: false,
      minWidth: 200,
    },
    {
      field: "paidLeaveAmount",
      headerName: "Ücretli İzin",
      editable: false,
      minWidth: 200,
    },
    {
      field: "unpaidLeaveAmount",
      headerName: "ücretsiz İzin",
      editable: false,
      minWidth: 200,
    },
    {
      field: "sickLeaveAmount",
      headerName: "Hastalık İzni",
      editable: false,
      minWidth: 200,
    },
    {
      field: "roadLeaveAmount",
      headerName: "Yol İzni",
      editable: false,
      minWidth: 200,
    },
    {
      field: "excuseLeaveAmount",
      headerName: "Mazeret İzni",
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

  const getRowId = (params: GetRowIdParams<EmployeesRows>) => {
    return params.data.id!;
  };

  const handleModalSubmit = async (
    formData: Partial<EmployeesRows>
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

      <EmployeesModal
        open={modalOpen}
        mode={modalMode}
        defaultValues={editData}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <BaseGrid<EmployeesRows>
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

export default EmployeesGrid;
