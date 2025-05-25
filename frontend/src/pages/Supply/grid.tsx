"use client";
import { useRef } from "react";
import { useSupply } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  CellValueChangedEvent,
  ColDef,
  GetRowIdParams,
} from "ag-grid-community";
import type { SupplyRows } from "./supply.types";

const SupplyGrid = () => {
  const { localData, loading, addRow, updateRow, deleteRows, saveChanges } =
    useSupply();

  const baseGridRef = useRef<BaseGridHandle<SupplyRows>>(null);

  const colDefs: ColDef<SupplyRows>[] = [
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
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "quantityItemCode",
      headerName: "Metraj",
      editable: true,
      minWidth: 200,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "companyName",
      headerName: "Şirket",
      editable: true,
      minWidth: 200,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "unit",
      headerName: "Birim",
      editable: true,
      minWidth: 200,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "unitPrice",
      headerName: "Birim Fiyatı",
      editable: true,
      minWidth: 200,
    },
    {
      field: "quantity",
      headerName: "Metraj",
      editable: true,
      minWidth: 200,
    },
    {
      field: "contractAmount",
      headerName: "Sözleşme Tutarı",
      editable: true,
      minWidth: 200,
    },
    {
      field: "paidAmount",
      headerName: "Ödenen Tutar",
      editable: true,
      minWidth: 200,
    },
    {
      field: "remainingAmount",
      headerName: "Kalan Tutar",
      editable: false,
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "Durum",
      editable: true,
      minWidth: 200,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
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
    },
    {
      field: "updatedatetime",
      headerName: "Güncelleme Tarihi",
      editable: false,
      minWidth: 200,
    },
  ];

  const getRowId = (params: GetRowIdParams<SupplyRows>) => {
    return params.data.id! ?? `${params.data.companyName}-${Math.random()}`;
  };

  const handleCellChange = (e: CellValueChangedEvent<SupplyRows>) => {
    updateRow({
      ...e.data
    });
  };

  return (
    <BaseGrid<SupplyRows>
      ref={baseGridRef}
      rowData={localData}
      columnDefs={colDefs}
      getRowId={getRowId}
      onAddRow={addRow}
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
  );
};

export default SupplyGrid;
