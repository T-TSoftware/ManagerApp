
import BaseGrid from "../../../components/grid/BaseGrid";
import { useLoanPaymentDetails } from "./hook";
import { LoanPaymentRows } from "./types";
import { ColDef, GetRowIdParams } from "ag-grid-community";


const CashDetailsGrid = ({ loanId }: { loanId: string }) => {
  const {
    localData,
    loading,
    addRow,
    updateRow,
    deleteRows,
    saveChanges,
    gridRef,
  } = useLoanPaymentDetails(loanId);
  const colDefs: ColDef<LoanPaymentRows>[] = [
    {
      field: "code",
      hide: true,
    },
    {
      field: "installmentNumber",
      headerName: "Taksit No",
      editable: (params) => params.data?.isNew === true,
      minWidth: 150,
      type: "numberColumn",
    },
    {
      field: "dueDate",
      headerName: "Vade Tarihi",
      editable: (params) => params.data?.isNew === true,
      minWidth: 180,
      type: "dateColumn",
    },
    {
      field: "totalAmount",
      headerName: "Toplam Tutar",
      editable: (params) => params.data?.isNew === true,
      minWidth: 160,
      type: "numberColumn",
    },
    {
      field: "interestAmount",
      headerName: "Faiz Tutarı",
      editable: (params) => params.data?.isNew === true,
      minWidth: 160,
      type: "numberColumn",
    },
    {
      field: "principalAmount",
      headerName: "Anapara Tutarı",
      editable: (params) => params.data?.isNew === true,
      minWidth: 160,
      type: "numberColumn",
    },
    {
      field: "paymentAmount",
      headerName: "Ödenen Tutar",
      editable: (params) => params.data?.isNew === true,
      minWidth: 160,
      type: "numberColumn",
    },
    {
      field: "penaltyAmount",
      headerName: "Ceza Tutarı",
      editable: (params) => params.data?.isNew === true,
      minWidth: 160,
      type: "numberColumn",
    },
    {
      field: "remainingAmount",
      headerName: "Kalan Tutar",
      editable: (params) => params.data?.isNew === true,
      minWidth: 160,
      type: "numberColumn",
    },
    {
      field: "status",
      headerName: "Durum",
      editable: (params) => params.data?.isNew === true,
      minWidth: 120,
    },
    {
      field: "paymentDate",
      headerName: "Ödeme Tarihi",
      editable: (params) => params.data?.isNew === true,
      minWidth: 180,
      type: "dateColumn",
    },
    {
      field: "description",
      headerName: "Açıklama",
      editable: (params) => params.data?.isNew === true,
      minWidth: 200,
    },
  ];


  const getRowId = (params: GetRowIdParams<LoanPaymentRows>) =>{
      if (!params.data) return "";
      return String(params.data.id || params.data.code);
    };

  return (
    <div className=" w-[950px] h-[450px] ">
      <BaseGrid<LoanPaymentRows>
        ref={gridRef}
        rowData={localData}
        columnDefs={colDefs}
        getRowId={getRowId}
        onAddRow={addRow}
        onDeleteRow={deleteRows}
        onSaveChanges={saveChanges}
        onCellValueChanged={updateRow}
        isLoading={loading}
        showButtons={{
          refresh: false,
          add: true,
          delete: false,
          save: true,
          bar: true,
        }}
      />
    </div>
  );
};

export default CashDetailsGrid;
