"use client";
import { useRef, useState } from "react";
import { useSubcontractor } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";
import type { SubcontractorRows } from "./types";
import { units } from "../../constants/stock/units";
import { stockCategories } from "../../constants/stock/stockCategories";
import { checkStatus } from "../../constants/check/checkStatus";
import { useNotifier } from "../../hooks/useNotifier";
import { FilePenLine } from "lucide-react";
import SubcontractorModal from "./modal";

const SubcontractorGrid = () => {
  const {   
    localData,
    loading,
    addRow,
    updateRow,
    saveChanges,
    alert,
    getById,
    create,
    update,} =
    useSubcontractor();

  const baseGridRef = useRef<BaseGridHandle<SubcontractorRows>>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editData, setEditData] = useState<
    Partial<SubcontractorRows> | undefined
  >();
  const notify = useNotifier();

  const colDefs: ColDef<SubcontractorRows>[] = [
    {
      headerName: "",
      field: "edit",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<SubcontractorRows>) => {
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
      editable: false,
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
      field: "companyName",
      headerName: "Şirket",
      editable: false,
      minWidth: 200,
    },
    {
      field: "unit",
      headerName: "Birim",
      editable: false,
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
      field: "unitPrice",
      headerName: "Birim Fiyatı",
      editable: false,
      minWidth: 200,
      type: "numberColumn",
    },
    {
      field: "quantity",
      headerName: "Miktar",
      editable: false,
      minWidth: 200,
      type: "numberColumn",
    },
    {
      field: "contractAmount",
      headerName: "Sözleşme Tutarı",
      editable: false,
      minWidth: 200,
      type: "numberColumn",
    },
    {
      field: "paidAmount",
      headerName: "Ödenen Tutar",
      editable: false,
      minWidth: 200,
      type: "numberColumn",
    },
    {
      field: "remainingAmount",
      headerName: "Kalan Tutar",
      editable: false,
      minWidth: 200,
      type: "numberColumn",
    },
    {
      field: "status",
      headerName: "Durum",
      editable: false,
      minWidth: 200,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: checkStatus.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = checkStatus.find((c) => c.code === value);
        return item?.name ?? value;
      },
    },
    {
      field: "description",
      headerName: "Açıklama",
      editable: true,
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
      editable: false,
      minWidth: 200,
      type: "dateTimeColumn",
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
      editable: false,
      minWidth: 200,
      type: "dateTimeColumn",
    },
  ];

  const getRowId = (params: GetRowIdParams<SubcontractorRows>) => {
    return params.data.id!;
  };

    const handleModalSubmit = async (
    formData: Partial<SubcontractorRows>
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
      
      <SubcontractorModal
        open={modalOpen}
        mode={modalMode}
        defaultValues={editData}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <BaseGrid<SubcontractorRows>
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
        //onDeleteRow={deleteRows}
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

export default SubcontractorGrid;
