"use client";
import { useCashFlow } from "./hook";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type { ColDef, GetRowIdParams } from "ag-grid-community";
import type { CashFlowRows } from "./types";
import { v4 as uuid } from "uuid";
import { checkTypes } from "../../constants/checkTypes";
import { paymentMethods } from "../../constants/paymentMethods";

const BankMovementGrid = () => {
  const { localData, loading, gridRef } = useCashFlow();

  const colDefs: ColDef<CashFlowRows>[] = [
    {
      field: "transactiondate",
      headerName: "İşlem Tarihi",
      type: "dateTimeColumn",
      editable: false,
      minWidth: 150,
    },
    {
      field: "method",
      headerName: "Yöntem",
      cellEditorParams: {
        values: paymentMethods.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = paymentMethods.find((c) => c.code === value);
        return item?.name ?? value;
      },
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
      field: "companyid",
      hide: true,
    },
  ];

  const getRowId = (params: GetRowIdParams<CashFlowRows>) => {
    return uuid();
  };

  return (
    <BaseGrid<CashFlowRows>
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
