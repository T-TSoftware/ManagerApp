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
    { 
      field: "code", 
      headerName: "Kod", 
      editable: false, 
      minWidth: 200 },
    {
      field: "category",
      headerName: "Kategori",
      editable: true,
      minWidth: 200,
      cellClassRules: {
        "border border-red-300 rounded-sm": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "companyName",
      headerName: "Şirket",
      editable: true,
      minWidth: 200,
    },
    {
      field: "unit",
      headerName: "Birim",
      editable: true,
      minWidth: 200,
      cellClassRules: {
        "border border-red-300 rounded-sm": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "unitPrice",
      headerName: "Birim Fiyatı",
      editable: true,
      minWidth: 200,
    },
    { field: "quantity", headerName: "Metraj", editable: true, minWidth: 200 },
    {
      field: "contractAmount",
      headerName: "Sözleşme Tutarı",
      editable: true,
      minWidth: 200,
    },
    {
      field: "paidAmount",
      headerName: "Ödenen Tutar",
      editable: true,
      minWidth: 200,
    },
    {
      field: "remainingAmount",
      headerName: "Kalan Tutar",
      editable: false,
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "Durum",
      editable: true,
      minWidth: 200,
      cellClassRules: {
        "border border-red-300 rounded-sm": (params) => !!params.data?.isNew,
      },
    },
    {
      field: "description",
      headerName: "Açıklama",
      editable: true,
      minWidth: 200,
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
    },
    {
      field: "updatedatetime",
      headerName: "Güncelleme Tarihi",
      editable: false,
      minWidth: 200,
    },
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
