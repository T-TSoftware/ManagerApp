"use client";
import { useRef, useState } from "react";
import BaseGrid, { BaseGridHandle } from "../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";
import type { LoansRows } from "./types";
import { useLoan } from "./hook";
import LoanTransactionModal from "./modal";
import Alert from "../../components/feedback/Alert";
import { financeCategory } from "../../constants/financeCategory";
import { FilePenLine, TicketPlus } from "lucide-react";
import InstallmentModal from "./installment-modal";

const LoanGrid = () => {
  const {
    localData,
    loading,
    addRow,
    updateRow,
    deleteRows,
    saveChanges,
    alert,
    setAlert,
    getById,
    create,
    update,
  } = useLoan();

  const baseGridRef = useRef<BaseGridHandle<LoansRows>>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [installmentModalOpen, setInstallmentModalOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<LoansRows> | undefined>();

  const resetModalState = () => {
    setModalOpen(false);
     setTimeout(() => {
       setEditData(undefined);
       setModalMode("create");
     }, 300);
  };

  const colDefs: ColDef<LoansRows>[] = [
    {
      headerName: "",
      field: "edit",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<LoansRows>) => {
        return (
          <button
            className="text-black hover:underline text-sm"
            onClick={async () => {
              if (!params.data?.id) return;
              const record = await getById(params.data.id);
              if (record) {
                setEditData(record);
                setModalMode("edit");
                setModalOpen(true);
              }
            }}
          >
            <FilePenLine
              aria-hidden="true"
              className="-mr-1 size-5 text-gray-500 dark:text-white"
            />
          </button>
        );
      },
    },
    {
      headerName: "Ekle",
      field: "createPayment",
      pinned: "left",
      width: 65,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellStyle: {
        justifyContent: "center",
        aligItems: "center",
        display: "flex",
        textAlign: "center",
      },
      cellRenderer: (params: ICellRendererParams<LoansRows>) => {
        return (
          <button
            className="text-black hover:underline text-sm content-center"
            onClick={async () => {
              if (!params.data?.id) return;
              const record = await getById(params.data.id);
              if (record) {
                setEditData(record);
                setInstallmentModalOpen(true);
              }
            }}
          >
            <TicketPlus
              aria-hidden="true"
              className="-mr-1 size-5 text-green-600 dark:text-white"
            />
          </button>
        );
      },
    },
    { field: "bank", hide: true },
    { field: "company", hide: true },
    { field: "project", hide: true },
    { field: "id", hide: true },
    { field: "code", headerName: "Kod", editable: false, minWidth: 200 },
    {
      field: "name",
      headerName: "Ad",
      editable: false,
      minWidth: 200,
    },
    {
      field: "accountNo",
      headerName: "Hesap No",
      editable: false,
      minWidth: 200,
    },
    {
      field: "totalAmount",
      headerName: "Toplam Kredi Tutarı",
      editable: false,
      minWidth: 200,
    },
    {
      field: "remainingPrincipal",
      headerName: "Kalan Ana Para",
      editable: false,
      minWidth: 200,
    },
    {
      field: "remainingInstallmentAmount",
      headerName: "Kalan Taksit Tutarı",
      editable: false,
      minWidth: 200,
    },
    {
      field: "remainingInstallmentCount",
      headerName: "Kalan Taksit Sayısı",
      editable: false,
      minWidth: 200,
    },
    {
      field: "interestRate",
      headerName: "Faiz Oranı",
      editable: false,
      minWidth: 200,
    },
    {
      field: "totalInstallmentCount",
      headerName: "Toplam Taksit Sayısı",
      editable: false,
      minWidth: 200,
    },
    {
      field: "loanDate",
      headerName: "Kredi Tarihi",
      type: "dateTimeColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "purpose",
      headerName: "Kredi Amacı",
      editable: false,
      minWidth: 200,
    },
    {
      field: "loanType",
      headerName: "Kredi Türü",
      cellEditorParams: {
        values: financeCategory.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = financeCategory.find((c) => c.code === value);
        return item?.name ?? value;
      },
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
      field: "description",
      headerName: "Açıklama",
      editable: false,
      minWidth: 200,
    },
    {
      field: "project",
      headerName: "Proje",
      editable: false,
      minWidth: 200,
    },
    {
      field: "createdatetime",
      headerName: "Oluşturulma Tarihi",
      type: "dateTimeColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "updatedatetime",
      headerName: "Güncellenme Tarihi",
      type: "dateTimeColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "createdby",
      headerName: "Oluşturan",
      editable: false,
      minWidth: 200,
    },
    {
      field: "updatedby",
      headerName: "Güncelleyen",
      editable: false,
      minWidth: 200,
    },
  ];

  const getRowId = (params: GetRowIdParams<LoansRows>) => {
    return params.data.id!;
  };

const handleSuccess = (message?: string, newData?: LoansRows) => {
  if (message) {
    setAlert({
      type: "success",
      message,
    });
  }

  if (newData) {
    if (modalMode === "create") {
      addRow(newData);
    } else {
      updateRow(newData);
    }
  }
  resetModalState();
};


const handleModalSubmit = async (formData: Partial<LoansRows>) => {
  if (modalMode === "create") {
    const newItem = await create(formData);
    handleSuccess("Kredi başarıyla oluşturuldu.", newItem);
  } else {
    const updatedItem = await update(formData);
    handleSuccess("Kredi başarıyla güncellendi.", updatedItem);
  }
};


  return (
    <>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <LoanTransactionModal
        open={modalOpen}
        mode={modalMode}
        defaultValues={editData}
        onClose={resetModalState}
        onSuccess={handleSuccess}
        onSubmit={handleModalSubmit}
      />
      <InstallmentModal
        open={installmentModalOpen}
        mode={modalMode}
        defaultValues={editData}
        onClose={resetModalState}
        onSuccess={handleSuccess}
        onSubmit={handleModalSubmit}
      />

      <BaseGrid<LoansRows>
        ref={baseGridRef}
        rowData={localData}
        columnDefs={colDefs}
        getRowId={getRowId}
        onOpenCreateModal={() => {
          setModalMode("create");
          setEditData(undefined);
          setModalOpen(true);
        }}
        enableSelection={false}
        onDeleteRow={deleteRows}
        onSaveChanges={saveChanges}
        isLoading={loading}
        showButtons={{
          refresh: true,
          add: true,
          delete: false,
          save: false,
          bar: true,
        }}
      />
    </>
  );
};

export default LoanGrid;
