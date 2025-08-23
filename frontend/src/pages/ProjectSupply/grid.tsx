"use client";
import { useRef, useState } from "react";
import { useSupply } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";
import type { SupplyRows } from "./types";
import { stockCategories } from "../../constants/stock/stockCategories";
import { units } from "../../constants/stock/units";
import { useNotifier } from "../../hooks/useNotifier";
import SupplyModal from "./modal";
import { FilePenLine } from "lucide-react";
import { supplierStatus } from "../../constants/supplier/supplierStatus";

const SupplyGrid = () => {
  const {
    localData,
    loading,
    addRow,
    updateRow,
    saveChanges,
    alert,
    getById,
    create,
    update,
  } = useSupply();

  const baseGridRef = useRef<BaseGridHandle<SupplyRows>>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editData, setEditData] = useState<Partial<SupplyRows> | undefined>();
  const notify = useNotifier();

  const colDefs: ColDef<SupplyRows>[] = [
    {
      headerName: "",
      field: "edit",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<SupplyRows>) => {
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
      field: "status",
      headerName: "Durum",
      editable: false,
      minWidth: 200,
      cellEditorParams: {
        values: supplierStatus.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = supplierStatus.find((c) => c.code === value);
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
      field: "category",
      headerName: "Kategori",
      editable: false,
      cellEditorParams: {
        values: stockCategories.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = stockCategories.find((c) => c.code === value);
        return item?.name ?? value;
      },
      minWidth: 200,
    },
    {
      field: "quantityItemCode",
      headerName: "Miktar Kodu",
      editable: false,
      minWidth: 200,
    },
    {
      field: "unit",
      headerName: "Birim",
      editable: false,
      cellEditorParams: {
        values: units.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = units.find((c) => c.code === value);
        return item?.name ?? value;
      },
      minWidth: 200,
    },
    {
      field: "unitPrice",
      headerName: "Birim Fiyatı",
      editable: false,
      minWidth: 200,
      type: "numberColumn",
    },
    {
      field: "projectQuantity.code",
      headerName: "Miktar Kodu",
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
      field: "description",
      headerName: "Açıklama",
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
      editable: false,
      minWidth: 200,
      valueFormatter: (params) => {
        return params.value
          ? new Date(params.value).toLocaleString("tr-TR")
          : "";
      },
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
      valueFormatter: (params) => {
        return params.value
          ? new Date(params.value).toLocaleString("tr-TR")
          : "";
      },
    },
  ];

  const getRowId = (params: GetRowIdParams<SupplyRows>) => {
    return params.data.id!;
  };

  const handleModalSubmit = async (formData: Partial<SupplyRows>) => {
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
      <SupplyModal
        open={modalOpen}
        mode={modalMode}
        defaultValues={editData}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <BaseGrid<SupplyRows>
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

export default SupplyGrid;
