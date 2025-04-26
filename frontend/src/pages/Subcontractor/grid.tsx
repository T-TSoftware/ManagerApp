"use client";
import React, { useState, useRef } from "react";
import { useSubcontractor } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  CellValueChangedEvent,
  ColDef,
  GetRowIdParams,
} from "ag-grid-community";
import type { SubcontractorRows } from "./subcontractor.types";

const SubcontractorGrid = () => {
  const {
    localData,
    loading,
    addRow,
    updateRow,
    deleteRows,
    saveChanges,
  } = useSubcontractor();

  const baseGridRef = useRef<BaseGridHandle<SubcontractorRows>>(null);

  const colDefs: ColDef<SubcontractorRows>[] = [
    { field: "code", editable: false, minWidth: 150 },
    {
      field: "category",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300 rounded-sm": (params) => !!params.data?.isNew,
      },
    },
    { field: "companyName", editable: true, minWidth: 150 },
    {
      field: "unit",
      editable: true,
      minWidth: 150,
      cellClassRules: {
        "border border-red-300 rounded-sm": (params) => !!params.data?.isNew,
      },
    },
    { field: "unitPrice", editable: true, minWidth: 150 },
    { field: "quantity", editable: true, minWidth: 150 },
    { field: "contractAmount", editable: true, minWidth: 150 },
    { field: "paidAmount", editable: true, minWidth: 150 },
    { field: "remainingAmount", editable: false, minWidth: 150 },
    {
      field: "status",
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

  const getRowId = (params: GetRowIdParams<SubcontractorRows>) =>
    String(params.data.code);

  const handleCellChange = (e: CellValueChangedEvent<SubcontractorRows>) => {
    updateRow({
      ...e.data,
      updatedatetime: new Date(), 
    });
  };

  return (
    <BaseGrid<SubcontractorRows>
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

export default SubcontractorGrid;
