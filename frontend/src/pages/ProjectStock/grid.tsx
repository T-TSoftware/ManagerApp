"use client";
import { useStock } from "./hook";
import BaseGrid from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
} from "ag-grid-community";
import type { StockRows } from "./types";
import { stockCategories } from "../../constants/stockCategories";
import { units } from "../../constants/units";

const StockGrid = () => {
  const { localData, loading, addRow, updateRow, deleteRows, saveChanges, gridRef } =
    useStock();

  const colDefs: ColDef<StockRows>[] = [
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
      field: "name",
      headerName: "İsim",
      editable: true,
      minWidth: 200,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
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
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
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
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "quantity",
      headerName: "Miktar",
      editable: true,
      minWidth: 200,
      type: "numberColumn",
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "description",
      headerName: "Açıklama",
      editable: true,
      minWidth: 200,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "location",
      headerName: "Konum",
      editable: true,
      minWidth: 200,
    },
    {
      field: "projectCode",
      hide: true,
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
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleString('tr-TR') : '';
      }
    },
    {
      field: "updatedatetime",
      headerName: "Güncelleme Tarihi",
      editable: false,
      minWidth: 200,
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleString('tr-TR') : '';
      }
    },
  ];

  const getRowId = (params: GetRowIdParams<StockRows>) => {
    if (!params.data) return '';
    return String(params.data.id || params.data.code);
  };

  return (
    <BaseGrid<StockRows>
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
        add: false,
        delete: false,
        save: false,
        bar: true,
      }}
    />
  );
};

export default StockGrid;
