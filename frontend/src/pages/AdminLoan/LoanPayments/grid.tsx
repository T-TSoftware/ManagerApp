
import { useRef, useState } from "react";
import BaseGrid, { BaseGridHandle } from "../../../components/grid/BaseGrid";
import { loanPaymentStatus } from "../../../constants/loan/loanPaymentStatus";

import { useLoanPaymentDetails } from "./hook";
import { LoanPaymentRows } from "./types";
import { ColDef, GetRowIdParams, ICellRendererParams } from "ag-grid-community";
import { FilePenLine } from "lucide-react";
import LoanPaymentModal from "./modal";
import { useNotifier } from "../../../hooks/useNotifier";


const LoanPaymentGrid = ({ loanId }: { loanId: string }) => {
  const {
    localData,
    loading,
    addRow,
    updateRow,
    saveChanges,
    gridRef,
    getById,
    update,
  } = useLoanPaymentDetails(loanId);
   const baseGridRef = useRef<BaseGridHandle<LoanPaymentRows>>(null);
   const [modalOpen, setModalOpen] = useState(false);
   const [editData, setEditData] = useState<
     Partial<LoanPaymentRows> | undefined
   >();
     const notify = useNotifier();

  const colDefs: ColDef<LoanPaymentRows>[] = [
    {
      headerName: "",
      field: "edit",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<LoanPaymentRows>) => (
        <button
          className="text-black hover:underline text-sm"
          onClick={async () => {
            if (!params.data?.id) return;
              const record = await getById(params.data.id);
              if (record) {
                setEditData(record);
                setModalOpen(true);
              }  
          }}
        >
          <FilePenLine className="size-5 text-gray-500 dark:text-white" />
        </button>
      )
        },
    {
      field: "code",
      headerName: "Kod",
      minWidth: 150,
    },
    {
      field: "paymentDate",
      hide: true,
    },
    {
      field: "installmentNumber",
      headerName: "Taksit No",
      editable: (params) => params.data?.isNew === true,
      minWidth: 150,
      type: "numberColumn",
      cellClassRules: {
        "border border-error bg-light_error dark:bg-dark_error ": (params) =>
          !!params.data?.isNew,
      },
    },
    {
      field: "dueDate",
      headerName: "Vade Tarihi",
      editable: (params) => params.data?.isNew === true,
      minWidth: 180,
      type: "dateColumn",
      cellClassRules: {
        "border border-error bg-light_error dark:bg-dark_error ": (params) =>
          !!params.data?.isNew,
      },
    },
    {
      field: "totalAmount",
      headerName: "Toplam Tutar",
      editable: (params) => params.data?.isNew === true,
      minWidth: 160,
      type: "numberColumn",
      cellClassRules: {
        "border border-error bg-light_error dark:bg-dark_error ": (params) =>
          !!params.data?.isNew,
      },
    },
    {
      field: "interestAmount",
      headerName: "Faiz Tutarı",
      editable: (params) => params.data?.isNew === true,
      minWidth: 160,
      type: "numberColumn",
      cellClassRules: {
        "border border-error bg-light_error dark:bg-dark_error ": (params) =>
          !!params.data?.isNew,
      },
    },
    {
      field: "principalAmount",
      headerName: "Anapara Tutarı",
      editable: (params) => params.data?.isNew === true,
      minWidth: 160,
      type: "numberColumn",
      cellClassRules: {
        "border border-error bg-light_error dark:bg-dark_error ": (params) =>
          !!params.data?.isNew,
      },
    },
    {
      field: "paymentAmount",
      headerName: "Ödenen Tutar",
      editable: false,
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
      editable: false,
      minWidth: 160,
      type: "numberColumn",
    },
    {
      field: "status",
      headerName: "Durum",
      editable: false,
      minWidth: 120,
      cellEditorParams: {
        values: loanPaymentStatus.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = loanPaymentStatus.find((c) => c.code === value);
        return item?.name ?? value;
      },
    },
    {
      field: "description",
      headerName: "Açıklama",
      editable: (params) => params.data?.isNew === true,
      minWidth: 200,
    },
  ];


  const getRowId = (params: GetRowIdParams<LoanPaymentRows>) =>{
      return String(params.data.id! || params.data.code!);
    };

    const handleModalSubmit = async (
    formData: Partial<LoanPaymentRows>
  ) => {
      const updatedItem = await update({ ...formData, id: editData!.id });
      updateRow(updatedItem);
       notify.success("Değişiklikler kaydedildi");
  };  

  return (
    <>
      <LoanPaymentModal
        open={modalOpen}
        defaultValues={editData}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <BaseGrid<LoanPaymentRows>
        ref={gridRef}
        rowData={localData}
        columnDefs={colDefs}
        getRowId={getRowId}
        onAddRow={addRow}
        onSaveChanges={saveChanges}
        enableSelection={false}
        isLoading={loading}
        showButtons={{
          refresh: false,
          add: true,
          delete: false,
          save: true,
          bar: true,
        }}
      />
    </>
  );
};

export default LoanPaymentGrid;
