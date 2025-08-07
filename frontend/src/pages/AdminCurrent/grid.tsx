"use client";
import { useCurrent } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
} from "ag-grid-community";
import type { CurrentRows } from "./types";
import { financeCategory } from "../../constants/financeCategory";
import { yesNo } from "../../constants/yesNo";

const CurrentGrid = () => {
  const { localData, loading, gridRef } =
    useCurrent();

  const colDefs: ColDef<CurrentRows>[] = [
    {
      field: "id",
      hide: true,
    },
    {
      field: "companyid",
      hide: true,
    },
    {
      field: "project",
      headerName: "Proje",
      editable: false,
      minWidth: 150,
    },
    {
      field: "firm",
      headerName: "Firma",
      editable: false,
      minWidth: 150,
    },
    {
      field: "income",
      headerName: "Gelen Ödeme",
      editable: false,
      minWidth: 200,
    },
    {
      field: "expense",
      headerName: "Giden Ödeme",
      editable: false,
      minWidth: 200,
    },
    {
      field: "invoiceyn",
      headerName: "Faturalandı mı?",
      editable: false,
      minWidth: 150,
      cellEditorParams: {
        values: yesNo.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = yesNo.find((c) => c.code === value);
        return item?.name ?? value;
      },
    },
    {
      field: "invoicecode",
      headerName: "Fatura Kodu",
      editable: false,
      minWidth: 200,
    },
    {
      field: "category",
      headerName: "Kategori",
      editable: false,
      minWidth: 200,
      cellEditorParams: {
        values: financeCategory.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = financeCategory.find((c) => c.code === value);
        return item?.name ?? value;
      },
    },
    {
      field: "checkcode",
      headerName: "Çek Kodu",
      editable: false,
      minWidth: 200,
    },
    {
      field: "description",
      headerName: "Açıklama",
      editable: false,
      minWidth: 150,
    },
    {
      field: "transactiondate",
      headerName: "İşlem Tarihi",
      type: "dateTimeColumn",
      editable: false,
      minWidth: 150,
    },
  ];

  const getRowId = (params: GetRowIdParams<CurrentRows>) => {
    if (!params.data) return '';
    return String(params.data.id);
  };

  return (
    <BaseGrid<CurrentRows>
      ref={gridRef}
      rowData={localData}
      columnDefs={colDefs}
      getRowId={getRowId}
      isLoading={loading}
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

export default CurrentGrid;
