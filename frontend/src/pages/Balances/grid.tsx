"use client";
import React, { useState, useRef } from "react";

import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  CellValueChangedEvent,
  ColDef,
  GetRowIdParams,
} from "ag-grid-community";
import type { BalanceRows } from "./types";
import { useBalance } from "./hook";
import Alert from "../../components/ui/Alert";

const BalanceGrid = () => {
  const {
    localData,
    loading,
    addRow,
    updateRow,
    deleteRows,
    saveChanges,
    alert,
    setAlert,
  } = useBalance();

  const baseGridRef = useRef<BaseGridHandle<BalanceRows>>(null);

  const colDefs: ColDef<BalanceRows>[] = [
    {
      headerName: "",
      field: "checkbox",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      pinned: "left",
      resizable:false,
      filter:false,
    },
    {
      field: "code",
      editable: false,
      minWidth: 150,
    },
    {
      field: "name",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300 rounded-sm": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "amount",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300 rounded-sm": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "currency",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300 rounded-sm": (params) => !!params.data?.isNew,
      },
    },
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
    <>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
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
