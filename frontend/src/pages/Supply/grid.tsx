"use client";
import React, { useState, useRef } from "react";
import { useSupply } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  ValueFormatterParams,
  GetRowIdParams,
} from "ag-grid-community";
import type { SupplyRows } from "./supply.types";
 
const SupplyGrid = () => {
  const { supplies, loading } = useSupply();
 
  // BaseGrid ref tanımı
  const baseGridRef = useRef<BaseGridHandle<SupplyRows>>(null);
 
  // Kolonlar
  const colDefs: ColDef<SupplyRows>[] = [
    { field: "code" },
    { field: "category" },
    { field: "quantityItem" },
    { field: "companyName" },
    { field: "unit" },
    { field: "unitPrice" },
    { field: "quantity" },
    { field: "contractAmount" },
    { field: "paidAmount" },
    { field: "remainingAmount" },
    { field: "status" },
    { field: "description" },
    { field: "createdBy" },
    { field: "updatedBy" },
    { field: "createdatetime" },
    { field: "updatedatetime" },
    // {
    //   field: "receivableBalance",
    //   valueFormatter: (params: ValueFormatterParams) =>
    //     `£${params.value.toLocaleString()}`,
    // },
    // {
    //   field: "debtBalance",
    //   valueFormatter: (params: ValueFormatterParams) =>
    //     `£${params.value.toLocaleString()}`,
    // },
  ];
 
  // Benzersiz ID'yi string olarak döndür
  const getRowId = (params: GetRowIdParams<SupplyRows>) =>
    String(params.data.code);
 
  // Satır ekleme işlemi
  const handleAddRow = () => {
    const newItem: SupplyRows = {
  code: "",
  category: "",
  quantityItem: "",
  companyName: "",
  unit: "",
  unitPrice: "",
  quantity: "",
  contractAmount: "",
  paidAmount: "",
  remainingAmount: "",
  status: "",
  description: "",
  createdBy: "",
  updatedBy: "",
  createdatetime: "",
  updatedatetime: "",
    };
    baseGridRef.current?.addRow(newItem);
  };
 
  // Seçilen satırları silme
  const handleDeleteRow = (selected: SupplyRows[]) => {
    baseGridRef.current?.deleteSelectedRows();
    console.log("Silinecek satırlar:", selected);
    
  };
 
  // Tüm verileri kaydet
  const handleSaveChanges = (allRows: SupplyRows[]) => {
    console.log("Kaydedilecek tüm satırlar:", allRows);
    
  };
 
  return (
    <BaseGrid<SupplyRows>
      ref={baseGridRef}
      rowData={supplies}
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
 
export default SupplyGrid;