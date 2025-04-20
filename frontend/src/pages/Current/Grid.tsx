"use client";
import React, { useState, useRef } from "react";
import { useCurrent } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import { HomeModernIcon } from "@heroicons/react/24/outline";
import type {
  ColDef,
  ValueFormatterParams,
  GetRowIdParams,
} from "ag-grid-community";
import type { CurrentRows } from "./current.types";

const CurrentGrid = () => {
  const { currents, loading } = useCurrent();
  const [selectedSite, setSelectedSite] = useState("All");

  // BaseGrid ref tanımı
  const baseGridRef = useRef<BaseGridHandle<CurrentRows>>(null);

  // Kolonlar
  const colDefs: ColDef<CurrentRows>[] = [
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
  const getRowId = (params: GetRowIdParams<CurrentRows>) =>
    String(params.data.currentNo);

  // Satır ekleme işlemi
  const handleAddRow = () => {
    const newItem: CurrentRows = {
      currentNo: Math.floor(Math.random() * 100000), 
      currentName: "",
      receivableBalance: 0,
      debtBalance: 0,
      currency: "",
    };
    baseGridRef.current?.addRow(newItem);
  };

  // Seçilen satırları silme
  const handleDeleteRow = (selected: CurrentRows[]) => {
    baseGridRef.current?.deleteSelectedRows(); 
    console.log("Silinecek satırlar:", selected);
    // İstersen burada bir API ile silme işlemi yapabilirsin
  };

  // Tüm verileri kaydet
  const handleSaveChanges = (allRows: CurrentRows[]) => {
    console.log("Kaydedilecek tüm satırlar:", allRows);
    // API gönderimi buraya yapılabilir
  };

  return (
    <BaseGrid<CurrentRows>
      ref={baseGridRef}
      rowData={currents}
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

export default CurrentGrid;
