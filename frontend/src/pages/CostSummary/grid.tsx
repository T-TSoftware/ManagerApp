"use client";
import React, { useState, useRef } from "react";
import { useCostSummaries } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type { ColDef, GetRowIdParams } from "ag-grid-community";
import type { CostSummaryRows } from "./costSum.types";

const CostSummaryGrid = () => {
  const { costSummaries, loading } = useCostSummaries();

  // BaseGrid ref tanımı
  const baseGridRef = useRef<BaseGridHandle<CostSummaryRows>>(null);

  // Kolonlar
  const colDefs: ColDef<CostSummaryRows>[] = [
    {
      field: "projectcode",
      headerName: "Proje Kodu",
      editable: false,
      minWidth: 200,
    },
    {
      field: "quantityitemcode",
      headerName: "Metraj Kodu",
      editable: false,
      minWidth: 200,
    },
    {
      field: "quantityitemname",
      headerName: "Metraj Adı",
      editable: false,
      minWidth: 200,
    },
    {
      field: "expectedquantity",
      headerName: "Beklenen Metraj",
      editable: false,
      minWidth: 200,
    },
    { field: "unit", headerName: "Miktar", editable: false, minWidth: 200 },
    {
      field: "suppliedquantity",
      headerName: "Tedarik Edilen Metraj",
      editable: false,
      minWidth: 200,
    },
    {
      field: "expectedpayment",
      headerName: "Tahmini Ödeme",
      editable: false,
      minWidth: 200,
    },
    { field: "totalpayment", headerName: "Toplam Ödeme", editable: false, minWidth: 200 },
    {
      field: "remainingpayment",
      headerName: "Kalan Ödeme",
      editable: false,
      minWidth: 200,
    },
    {
      field: "remainingquantity",
      headerName: "Kalan Metraj",
      editable: false,
      minWidth: 200,
    },
    { field: "overlimit", headerName: "Üst Limit", editable: false, minWidth: 200 },
  ];
  const getRowId = (params: GetRowIdParams<CostSummaryRows>) =>
    String(params.data.quantityitemcode);

  return (
    <BaseGrid<CostSummaryRows>
      ref={baseGridRef}
      rowData={costSummaries}
      columnDefs={colDefs}
      isLoading={loading}
      getRowId={getRowId}
      showButtons={{
        refresh: true,
        add: false,
        delete: false,
        save: false,
        bar: true,
      }}
    />
  );
};
export default CostSummaryGrid;
