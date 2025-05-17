"use client";
import React, { useState, useRef } from "react";
import { useQuantity } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  CellValueChangedEvent,
  ColDef,
  GetRowIdParams,
} from "ag-grid-community";
import type { QuantityRows } from "./quantity.types";

const QuantityGrid = () => {
  const { localData, loading, addRow, updateRow, deleteRows, saveChanges } =
    useQuantity();

  const baseGridRef = useRef<BaseGridHandle<QuantityRows>>(null);

  const colDefs: ColDef<QuantityRows>[] = [
    { field: "id", hide: true },
    { field: "code", headerName: "Kod", editable: false, minWidth: 200 },
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
      field: "quantityItemCode",
      headerName: "Metraj Kodu",
      editable: true,
      minWidth: 200,
      cellClassRules: {
        "border border-red-300 rounded-sm": (params) => !!params.data?.isNew,
      },
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
      field: "quantity",
      headerName: "Metraj",
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

  const getRowId = (params: GetRowIdParams<QuantityRows>) =>
    String(params.data.id);

  const handleCellChange = (e: CellValueChangedEvent<QuantityRows>) => {
    updateRow({
      ...e.data,
      updatedatetime: new Date(),
    });
  };

  return (
    <BaseGrid<QuantityRows>
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

export default QuantityGrid;
