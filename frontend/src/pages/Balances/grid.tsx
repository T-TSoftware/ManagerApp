"use client";
import React, { useState, useRef } from "react";
import { useBalance } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  CellValueChangedEvent,
  ColDef,
  GetRowIdParams,
} from "ag-grid-community";
import type { BalanceRows } from "./types";

const BalanceGrid = () => {
  const { localData, loading, addRow, updateRow, deleteRows, saveChanges } =
    useBalance();

  const baseGridRef = useRef<BaseGridHandle<BalanceRows>>(null);

  const colDefs: ColDef<BalanceRows>[] = [
    { field: "code", editable: true, minWidth: 150 },
    { field: "name", editable: true, minWidth: 150 },
    { field: "amount", editable: true, minWidth: 150 },
    { field: "currency", editable: true, minWidth: 150 },
  ];

  const getRowId = (params: GetRowIdParams<BalanceRows>) => {
    return params.data.id || params.data.code;
  };

  const handleCellChange = (e: CellValueChangedEvent<BalanceRows>) => {
    updateRow({
      ...e.data,
    });
  };

  return (
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
  );
};

export default BalanceGrid;
