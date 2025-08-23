"use client";
import React, { useState, useRef } from "react";
import { useDashboard } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type { ColDef, GetRowIdParams } from "ag-grid-community";
import { UpcomingPaymentsRows } from "./type";

const UpcomingPaymentsGrid = () => {
  const { upcomingPayments, loading } = useDashboard();

  const baseGridRef = useRef<BaseGridHandle<UpcomingPaymentsRows>>(null);

  // Kolonlar
  const colDefs: ColDef<UpcomingPaymentsRows>[] = [
    {
      field: "code",
      headerName: "Kod",
      editable: false,
      minWidth: 200,
    },
    {
      field: "category",
      headerName: "Kategori",
      editable: false,
      minWidth: 200,
    },
    {
      field: "duedate",
      headerName: "Son Ödeme Tarihi",
      editable: false,
      minWidth: 200,
    },
    { field: "amount", headerName: "Miktar", editable: false, minWidth: 200 },
    {
      field: "remainingamount",
      headerName: "Kalan Ödeme",
      editable: false,
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "Durum",
      editable: false,
      minWidth: 200,
    },
    {
      field: "remainingdays",
      headerName: "Kalan Gün",
      editable: false,
      minWidth: 200,
    },
    {
      field: "createdatetime",
      headerName: "Kalan Ödeme",
      editable: false,
      minWidth: 200,
    },
  ];
  const getRowId = (params: GetRowIdParams<UpcomingPaymentsRows>) =>
    params.data.id!;

  return (
    <BaseGrid<UpcomingPaymentsRows>
      ref={baseGridRef}
      rowData={upcomingPayments}
      columnDefs={colDefs}
      isLoading={loading}
      getRowId={getRowId}
      title= "Yaklaşan Ödemeler"
      enableSelection= {false}
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
export default UpcomingPaymentsGrid;
