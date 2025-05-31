"use client";
import { useRef } from "react";
import { useCurrent } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
} from "ag-grid-community";
import type { CurrentRows } from "./current.types";

const CurrentGrid = () => {
  const { localData, loading, addRow, updateRow, deleteRows, saveChanges, gridRef } =
    useCurrent();

  const colDefs: ColDef<CurrentRows>[] = [
    {
      field: "id",
      headerName: "ID",
      hide: true,
    },
    {
      field: "type",
      headerName: "Cari Tipi",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "balanceCode",
      headerName: "Hesap Kodu",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "amount",
      headerName: "Tutar",
      type: "numberColumn",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "currency",
      headerName: "Döviz Tipi",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "description",
      headerName: "Açıklama",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "transactionDate",
      headerName: "İşlem Tarihi",
      type: "dateTimeColumn",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
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

  const getRowId = (params: GetRowIdParams<CurrentRows>) => {
    if (!params.data) return '';
    return String(params.data.id);
  };

  return (
    <BaseGrid<CurrentRows>
      ref={gridRef}
      rowData={localData}
      columnDefs={colDefs}
      getRowId={getRowId}
      onAddRow={addRow}
      onDeleteRow={deleteRows}
      onSaveChanges={saveChanges}
      onCellValueChanged={updateRow}
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

export default CurrentGrid;
