"use client";
import { useRef } from "react";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
} from "ag-grid-community";
import type { BalanceRows } from "./types";
import { useBalance } from "./hook";
import { currencyList } from "../../constants/common/currencyList";

const BalanceGrid = () => {
  const {
    localData,
    loading,
    addRow,
    updateRow,
    deleteRows,
    saveChanges,
    gridRef,
  } = useBalance();

  
  const colDefs: ColDef<BalanceRows>[] = [
    {
      field: "code",
      headerName: "Kod",
      editable: false,
      minWidth: 150,
    },
    {
      field: "name",
      headerName: "Ad",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-error bg-light_error dark:bg-dark_error ": (params) =>
          !!params.data?.isNew,
      },
    },
    {
      field: "amount",
      headerName: "Miktar",
      editable: true,
      minWidth: 150,
      type: "numberColumn",
      cellClassRules: {
        "border border-error bg-light_error dark:bg-dark_error ": (params) =>
          !!params.data?.isNew,
      },
    },
    {
      field: "currency",
      headerName: "Döviz Birimi",
      editable: true,
      minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: currencyList.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = currencyList.find((c) => c.code === value);
        return item?.name ?? value;
      },
      cellClassRules: {
        "border border-error bg-light_error dark:bg-dark_error ": (params) =>
          !!params.data?.isNew,
      },
    },
  ];

  const getRowId = (params: GetRowIdParams<BalanceRows>) => {
    return params.data.id!;
  };

  return (
    <>
      <BaseGrid<BalanceRows>
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
          delete: false,
          save: true,
          bar: true,
        }}
      />
    </>
  );
};

export default BalanceGrid;
