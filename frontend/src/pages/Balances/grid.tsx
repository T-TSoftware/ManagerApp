"use client";
import { useRef } from "react";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  CellValueChangedEvent,
  ColDef,
  GetRowIdParams,
} from "ag-grid-community";
import type { BalanceRows } from "./types";
import { useBalance } from "./hook";

const BalanceGrid = () => {
  const {
    localData,
    loading,
    addRow,
    updateRow,
    deleteRows,
    saveChanges,
  } = useBalance();

  const baseGridRef = useRef<BaseGridHandle<BalanceRows>>(null);

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
        "border border-red-300 rounded-sm": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "amount",
      headerName: "Miktar",
      editable: true,
      minWidth: 150,
      valueParser: (params) => {
        const val = params.newValue?.toString().replace(",", ".");
        return parseFloat(val);
      },
      cellClassRules: {
        "border border-red-300 rounded-sm": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "currency",
      headerName: "Döviz Birimi",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300 rounded-sm": (params) => !!params.data?.isNew,
      },
    },
  ];

  const getRowId = (params: GetRowIdParams<BalanceRows>) => {
    return params.data.id!;
  };
  const handleCellChange = (e: CellValueChangedEvent<BalanceRows>) => {
    updateRow({
      ...e.data,
    });
  };

  return (
    <>
      <BaseGrid<BalanceRows>
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
    </>
  );
};

export default BalanceGrid;
