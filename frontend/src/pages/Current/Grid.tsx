"use client";
import React, { useState, useRef } from "react";
import { useCurrent } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  CellValueChangedEvent,
  ColDef,
  GetRowIdParams,
} from "ag-grid-community";
import type { CurrentRows } from "./current.types";

const CurrentGrid = () => {
  const { localData, loading, addRow, updateRow, deleteRows, saveChanges } =
    useCurrent();

  const baseGridRef = useRef<BaseGridHandle<CurrentRows>>(null);

  const colDefs: ColDef<CurrentRows>[] = [
    { field: "id", editable: false, minWidth: 150, hide: true },
    {
      field: "type",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "balanceCode",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "amount",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "currency",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    { field: "description", editable: true, minWidth: 150 },
    {
      field: "transactionDate",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300": (params) => !!params.data?.isNew,
      },
    },
    { field: "createdBy", editable: false, minWidth: 150 },
    { field: "updatedBy", editable: false, minWidth: 150 },
    { field: "createdatetime", editable: false, minWidth: 150 },
    { field: "updatedatetime", editable: false, minWidth: 150 },
  ];

  const getRowId = (params: GetRowIdParams<CurrentRows>) =>
    String(params.data.id);

  const handleCellChange = (e: CellValueChangedEvent<CurrentRows>) => {
    updateRow({
      ...e.data,
      updatedatetime: new Date(),
    });
  };

  return (
    <BaseGrid<CurrentRows>
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

export default CurrentGrid;
