"use client";
import React, { useState, useRef } from "react";
import { useDashboard } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type { ColDef, GetRowIdParams } from "ag-grid-community";
import { UpcomingCollectionsRows } from "./type";
import { status } from "../../constants/common/status";
import { upcomingType } from "../../constants/dashboard/upcomingType";

const UpcomingCollectionsGrid = () => {
  const { upcomingCollections, loading } = useDashboard();

  const baseGridRef = useRef<BaseGridHandle<UpcomingCollectionsRows>>(null);

  // Kolonlar
  const colDefs: ColDef<UpcomingCollectionsRows>[] = [
    {
      field: "code",
      headerName: "Kod",
      editable: false,
      minWidth: 200,
    },
    {
      field: "category",
      headerName: "Kategori",
      cellEditorParams: {
        values: upcomingType.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = upcomingType.find((c) => c.code === value);
        return item?.name ?? value;
      },
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
      cellEditorParams: {
        values: status.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = status.find((c) => c.code === value);
        return item?.name ?? value;
      },
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
  const getRowId = (params: GetRowIdParams<UpcomingCollectionsRows>) =>
    params.data.id!;

  return (
    <BaseGrid<UpcomingCollectionsRows>
      ref={baseGridRef}
      rowData={upcomingCollections}
      columnDefs={colDefs}
      isLoading={loading}
      getRowId={getRowId}
      title="Yaklaşan Tahsilatlar"
      enableSelection={false}
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
export default UpcomingCollectionsGrid;
