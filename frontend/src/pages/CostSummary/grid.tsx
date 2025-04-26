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
    { field: "projectid", editable: false, minWidth: 150 },
    { field: "projectcode", editable: false, minWidth: 150 },
    { field: "quantityitemcode", editable: false, minWidth: 150 },
    { field: "quantityitemname", editable: false, minWidth: 150 },
    { field: "expectedquantity", editable: false, minWidth: 150 },
    { field: "unit", editable: false, minWidth: 150 },
    { field: "suppliedquantity", editable: false, minWidth: 150 },
    { field: "expectedpayment", editable: false, minWidth: 150 },
    { field: "totalpayment", editable: false, minWidth: 150 },
    { field: "remainingpayment", editable: false, minWidth: 150 },
    { field: "remainingquantity", editable: false, minWidth: 150 },
    { field: "overlimit", editable: false, minWidth: 150 },
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
