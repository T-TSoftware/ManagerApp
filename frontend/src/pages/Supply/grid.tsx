"use client";
import React, { useState, useRef } from "react";
import { useSupply } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  CellValueChangedEvent,
  ColDef,
  GetRowIdParams,
} from "ag-grid-community";
import type { SupplyRows } from "./supply.types";

const SupplyGrid = () => {
  const {
    localData,
    loading,
    addRow,
    updateRow,
    deleteRows,
    saveChanges,
  } = useSupply();

  const baseGridRef = useRef<BaseGridHandle<SupplyRows>>(null);

  const colDefs: ColDef<SupplyRows>[] = [
    { field: "code", editable: true, minWidth: 150 },
    { field: "category", editable: true, minWidth: 150 },
    { field: "quantityItemCode", editable: true, minWidth: 150 },
    { field: "companyName", editable: true, minWidth: 150 },
    { field: "unit", editable: true, minWidth: 150 },
    { field: "unitPrice", editable: true, minWidth: 150 },
    { field: "quantity", editable: true, minWidth: 150 },
    { field: "contractAmount", editable: true, minWidth: 150 },
    { field: "paidAmount", editable: true, minWidth: 150 },
    { field: "remainingAmount", editable: true, minWidth: 150 },
    { field: "status", editable: true, minWidth: 150 },
    { field: "description", editable: true, minWidth: 150 },
    { field: "createdBy", editable: true, minWidth: 150 },
    { field: "updatedBy", editable: true, minWidth: 150 },
    { field: "createdatetime", editable: true, minWidth: 150 },
    { field: "updatedatetime", editable: true, minWidth: 150 },
  ];

  const getRowId = (params: GetRowIdParams<SupplyRows>) =>
    String(params.data.code);

  const handleCellChange = (e: CellValueChangedEvent<SupplyRows>) => {
    updateRow({
      ...e.data,
      updatedatetime: new Date(), 
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
