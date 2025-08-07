import BaseGrid from "../../../../components/grid/BaseGrid";
import { useCashDetails } from "./hook";
import { BarterItemCashDetailRows } from "./types";
import { ColDef, GetRowIdParams } from "ag-grid-community";
import { cashPaymentMethods } from "../../../../constants/cashPaymentMethods";
import { currencyList } from "../../../../constants/currencyList";

const CashDetailsGrid = ({ barterItemId }: { barterItemId: string }) => {
  const { localData, loading, gridRef } =
    useCashDetails(barterItemId);
   console.log(localData);
  const colDefs: ColDef<BarterItemCashDetailRows>[] = [
    {
      field: "amount",
      headerName: "Tutar",
      editable: true,
      minWidth: 150,
      type: "numberColumn",
    },
    {
      field: "currency",
      headerName: "Döviz Türü",
      editable: true,
      minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: currencyList.map((p) => p.code) },
      valueFormatter: ({ value }) =>
        currencyList.find((p) => p.code === value)?.name || value,
    },
    {
      field: "fromAccountId",
      headerName: "Çıkan Hesap",
      editable: true,
      minWidth: 250,
    },
    {
      field: "accountType",
      headerName: "Hesap Tipi",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: cashPaymentMethods.map((p) => p.code) },
      valueFormatter: ({ value }) =>
        cashPaymentMethods.find((p) => p.code === value)?.name || value,

      minWidth: 250,
    },
    {
      field: "description",
      headerName: "Açıklama",
      editable: true,
      minWidth: 250,
    },
  ];

  const getRowId = (params: GetRowIdParams<BarterItemCashDetailRows>) =>
    params.data?.id ?? "";

  return (
    <div className="w-[950px] h-[450px] ">
      <BaseGrid<BarterItemCashDetailRows>
        ref={gridRef}
        rowData={localData}
        columnDefs={colDefs}
        getRowId={getRowId}
        isLoading={loading}
        showButtons={{
          refresh: false,
          add: false,
          delete: false,
          save: false,
          bar: false,
        }}
      />
    </div>
  );
};

export default CashDetailsGrid;
