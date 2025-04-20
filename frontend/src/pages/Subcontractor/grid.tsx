"use client";
import React, { useState, useRef } from "react";
import { useSubcontractor } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  ValueFormatterParams,
  GetRowIdParams,
} from "ag-grid-community";
import type { SubcontractorRows } from "./subcontractor.types";

const SubcontractorGrid = () => {
  const { subcontractor, loading } = useSubcontractor();

  // BaseGrid ref tanımı
  const baseGridRef = useRef<BaseGridHandle<SubcontractorRows>>(null);

  // Kolonlar
  const colDefs: ColDef<SubcontractorRows>[] = [
    { field: "currentNo" },
    { field: "currentName" },
    {
      field: "receivableBalance",
      valueFormatter: (params: ValueFormatterParams) =>
        `£${params.value.toLocaleString()}`,
    },
    {
      field: "debtBalance",
      valueFormatter: (params: ValueFormatterParams) =>
        `£${params.value.toLocaleString()}`,
    },
    { field: "currency" },
  ];

  // Benzersiz ID'yi string olarak döndür
  const getRowId = (params: GetRowIdParams<SubcontractorRows>) =>
    String(params.data.currentNo);

  // Satır ekleme işlemi
  const handleAddRow = () => {
    const newItem: SubcontractorRows = {
      currentNo: Math.floor(Math.random() * 100000),
      currentName: "",
      receivableBalance: 0,
      debtBalance: 0,
      currency: "",
    };
    baseGridRef.current?.addRow(newItem);
  };

  // Seçilen satırları silme
  const handleDeleteRow = (selected: SubcontractorRows[]) => {
    baseGridRef.current?.deleteSelectedRows();
    console.log("Silinecek satırlar:", selected);
    // İstersen burada bir API ile silme işlemi yapabilirsin
  };

  // Tüm verileri kaydet
  const handleSaveChanges = (allRows: SubcontractorRows[]) => {
    console.log("Kaydedilecek tüm satırlar:", allRows);
    // API gönderimi buraya yapılabilir
  };

  return (
    <BaseGrid<SubcontractorRows>
      ref={baseGridRef}
      rowData={subcontractor}
      columnDefs={colDefs}
      getRowId={getRowId}
      onAddRow={handleAddRow}
      onDeleteRow={handleDeleteRow}
      onSaveChanges={handleSaveChanges}
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
