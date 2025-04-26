"use client";
import React, { useState, useRef } from "react";
import { useQuantity } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  CellValueChangedEvent,
  ColDef,
  GetRowIdParams,
} from "ag-grid-community";
import type { QuantityRows } from "./quantity.types";

const QuantityGrid = () => {
  const { localData, loading, addRow, updateRow, deleteRows, saveChanges } =
    useQuantity();

  const baseGridRef = useRef<BaseGridHandle<QuantityRows>>(null);

  const colDefs: ColDef<QuantityRows>[] = [
    { field: "id", editable: false, minWidth: 150, hide: true },
    { field: "code", editable: false, minWidth: 150 },
    {
      field: "category",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300 rounded-sm": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "quantityItemCode",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300 rounded-sm": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "unit",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300 rounded-sm": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "quantity",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300 rounded-sm": (params) => !!params.data?.isNew,
      },
    },
    { field: "description", editable: true, minWidth: 150 },
    { field: "createdBy", editable: false, minWidth: 150 },
    { field: "updatedBy", editable: false, minWidth: 150 },
    { field: "createdatetime", editable: false, minWidth: 150 },
    { field: "updatedatetime", editable: false, minWidth: 150 },
  ];

  const getRowId = (params: GetRowIdParams<QuantityRows>) =>
    String(params.data.id);

  const handleCellChange = (e: CellValueChangedEvent<QuantityRows>) => {
    updateRow({
      ...e.data,
      updatedatetime: new Date(),
    });
  };

  return (
    <BaseGrid<QuantityRows>
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

export default QuantityGrid;
