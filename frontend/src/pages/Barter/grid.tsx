"use client";
import { useRef, useState } from "react";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";
import type { BarterRows } from "./types";
import { useBarter } from "./hook";
import Alert from "../../components/feedback/Alert";
import { FilePenLine } from "lucide-react";
import BarterAgreementModal from "./modal";
import { loanStatus } from "../../constants/loanStatus";
import { counterPartyType } from "../../constants/counterPartyType";
import { useNotifier } from "../../hooks/useNotifier";

type Props = {
  onBarterSelected?: (id: string) => void;
};

const BarterAgreementGrid = ({ onBarterSelected }: Props) => {
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
  } = useBarter();

  const baseGridRef = useRef<BaseGridHandle<BarterRows>>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editData, setEditData] = useState<Partial<BarterRows> | undefined>();
  const notify = useNotifier();
  const colDefs: ColDef<BarterRows>[] = [
    {
      headerName: "",
      field: "edit",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<BarterRows>) => {
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
      field: "counterpartyId",
      hide: true,
    },
    { field: "code", headerName: "Kod", editable: false, minWidth: 200 },
    {
      field: "counterpartyType",
      headerName: "Karşı Taraf Tipi",
      cellEditorParams: {
        values: counterPartyType.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = counterPartyType.find((c) => c.code === value);
        return item?.name ?? value;
      },
      editable: false,
      minWidth: 200,
    },
    {
      field: "counterpartyName",
      headerName: "Karşı Taraf Adı",
      editable: false,
      minWidth: 200,
    },
    {
      field: "totalOurValue",
      headerName: "Gider Değeri",
      type: "numberColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "totalTheirValue",
      headerName: "Gelir Değeri",
      type: "numberColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "Durum",
      cellEditorParams: {
        values: loanStatus.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = loanStatus.find((c) => c.code === value);
        return item?.name ?? value;
      },
      editable: false,
      minWidth: 200,
    },
    {
      field: "agreementDate",
      headerName: "Anlaşma Tarihi",
      type: "dateTimeColumn",
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
      field: "project.name",
      headerName: "Proje",
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
  ];

  const getRowId = (params: GetRowIdParams<BarterRows>) => {
    return params.data.id!;
  };

  const handleModalSubmit = async (formData: Partial<BarterRows>) => {
    if (modalMode === "create") {
      const newItem = await create(formData);
      addRow(newItem);
      notify.success("Kayıt başarıyla oluşturuldu");
    } else {
      console.log(formData);
      const updatedItem = await update({ ...formData, id: editData!.id });
      updateRow(updatedItem);
      notify.success("Değişiklikler kaydedildi");
    }
  };

  return (
    <>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <BarterAgreementModal
        open={modalOpen}
        mode={modalMode}
        defaultValues={editData}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <BaseGrid<BarterRows>
        ref={baseGridRef}
        rowData={localData}
        columnDefs={colDefs}
        getRowId={getRowId}
        onOpenCreateModal={() => {
          setModalMode("create");
          setEditData(undefined);
          setModalOpen(true);
        }}
        autoSelectRowOnClick={true}
        onRowClick={(row) => {
          onBarterSelected?.(row.id!);
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

export default BarterAgreementGrid;
