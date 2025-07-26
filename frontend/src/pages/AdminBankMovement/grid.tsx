"use client";
import { useCurrent } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
} from "ag-grid-community";
import type { BankMovementRows } from "./types";
import { financeCategory } from "../../constants/financeCategory";
import { currencyList } from "../../constants/currencyList";
import { paymentMethods } from "../../constants/paymentMethods";

const BankMovementGrid = () => {
  const { localData, loading, gridRef } = useCurrent();

  const colDefs: ColDef<BankMovementRows>[] = [
    {
      field: "id",
      hide: true,
    },
    {
      field: "companyid",
      hide: true,
    },
    {
      field: "projectid",
      hide: true,
    },
    {
      field: "code",
      headerName: "Kod",
      editable: false,
      minWidth: 150,
    },
    {
      field: "from_account",
      headerName: "Kaynak Hesap",
      editable: false,
      minWidth: 200,
    },
    {
      field: "to_account",
      headerName: "Hedef Hesap",
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
      field: "currency",
      headerName: "Para Birimi",
      editable: false,
      minWidth: 200,
      cellEditorParams: {
        values: currencyList.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = currencyList.find((c) => c.code === value);
        return item?.name ?? value;
      },
    },
    {
      field: "method",
      headerName: "Yöntem",
      editable: false,
      cellEditorParams: {
        values: paymentMethods.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = paymentMethods.find((c) => c.code === value);
        return item?.name ?? value;
      },
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
      field: "income",
      headerName: "Gelen Ödeme",
      editable: false,
      minWidth: 150,
    },
    {
      field: "expense",
      headerName: "Giden Ödeme",
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

  const getRowId = (params: GetRowIdParams<BankMovementRows>) => {
    if (!params.data) return "";
    return String(params.data.id);
  };

  return (
    <BaseGrid<BankMovementRows>
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

export default BankMovementGrid;
