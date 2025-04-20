"use client";
import React, { useState, useRef } from "react";
import { useDashboard } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  ValueFormatterParams,
  GetRowIdParams,
} from "ag-grid-community";
import type { DashboardRows } from "./dashboard.types";

const DashboardGrid = () => {
  const { dashboard, loading } = useDashboard();

  // BaseGrid ref tanımı
  const baseGridRef = useRef<BaseGridHandle<DashboardRows>>(null);

  // Kolonlar
  const colDefs: ColDef<DashboardRows>[] = [
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
  const getRowId = (params: GetRowIdParams<DashboardRows>) =>
    String(params.data.currentNo);

  // Satır ekleme işlemi
  const handleAddRow = () => {
    const newItem: DashboardRows = {
      currentNo: Math.floor(Math.random() * 100000),
      currentName: "",
      receivableBalance: 0,
      debtBalance: 0,
      currency: "",
    };
    baseGridRef.current?.addRow(newItem);
  };

  // Seçilen satırları silme
  const handleDeleteRow = (selected: DashboardRows[]) => {
    baseGridRef.current?.deleteSelectedRows();
    console.log("Silinecek satırlar:", selected);
    // İstersen burada bir API ile silme işlemi yapabilirsin
  };

  // Tüm verileri kaydet
  const handleSaveChanges = (allRows: DashboardRows[]) => {
    console.log("Kaydedilecek tüm satırlar:", allRows);
    // API gönderimi buraya yapılabilir
  };

  return (
    <BaseGrid<DashboardRows>
      ref={baseGridRef}
      rowData={dashboard}
      columnDefs={colDefs}
      getRowId={getRowId}
      onAddRow={handleAddRow}
      onDeleteRow={handleDeleteRow}
      onSaveChanges={handleSaveChanges}
      isLoading={loading}
      showButtons={{
        refresh: false,
        add: false,
        delete: false, 
        save: false,
        bar: false,
      }}
    />
  );
};

export default DashboardGrid;
