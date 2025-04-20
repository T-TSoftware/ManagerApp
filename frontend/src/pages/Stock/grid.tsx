"use client";
import React, { useState, useRef } from "react";
import { useStock } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  ValueFormatterParams,
  GetRowIdParams,
} from "ag-grid-community";
import type { StockRows } from "./stock.types";

const StockGrid = () => {
  const { stocks, loading } = useStock();

  // BaseGrid ref tanımı
  const baseGridRef = useRef<BaseGridHandle<StockRows>>(null);

  // Kolonlar
  const colDefs: ColDef<StockRows>[] = [
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
  const getRowId = (params: GetRowIdParams<StockRows>) =>
    String(params.data.currentNo);

  // Satır ekleme işlemi
  const handleAddRow = () => {
    const newItem: StockRows = {
      currentNo: Math.floor(Math.random() * 100000),
      currentName: "",
      receivableBalance: 0,
      debtBalance: 0,
      currency: "",
    };
    baseGridRef.current?.addRow(newItem);
  };

  // Seçilen satırları silme
  const handleDeleteRow = (selected: StockRows[]) => {
    baseGridRef.current?.deleteSelectedRows();
    console.log("Silinecek satırlar:", selected);
    // İstersen burada bir API ile silme işlemi yapabilirsin
  };

  // Tüm verileri kaydet
  const handleSaveChanges = (allRows: StockRows[]) => {
    console.log("Kaydedilecek tüm satırlar:", allRows);
    // API gönderimi buraya yapılabilir
  };

  return (
    <BaseGrid<StockRows>
      ref={baseGridRef}
      rowData={stocks}
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

export default StockGrid;
