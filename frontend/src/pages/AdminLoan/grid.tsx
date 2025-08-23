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
import { financeCategory } from "../../constants/finance/financeCategory";
import LoanPaymentModal from "./LoanPayments/modal";
import { useNotifier } from "../../hooks/useNotifier";
import { loanStatus } from "../../constants/loan/loanStatus";
import { currencyList } from "../../constants/common/currencyList";


type Props = {
  onLoanSelected?: (id: string) => void;
};

const LoanGrid = ({ onLoanSelected }: Props ) => {
  const {
    localData,
    loading,
    accountOptions,
    addRow,
    updateRow,
    deleteRows,
    alert,
    setAlert,
    getById,
    create,
    update,
  } = useLoan();

  const baseGridRef = useRef<BaseGridHandle<LoansRows>>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editData, setEditData] = useState<Partial<LoansRows> | undefined>();
  const notify = useNotifier();
  const resetModalState = () => {
    setModalOpen(false);
    setTimeout(() => {
      setEditData(undefined);
      setModalMode("create");
    }, 300);
  };

  const colDefs: ColDef<LoansRows>[] = [
    /*     {
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
    }, */
    { field: "bankCode", hide: true },
    { field: "company", hide: true },
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
      field: "currency",
      headerName: "Döviz Türü",
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
      field: "totalAmount",
      headerName: "Toplam Kredi Tutarı",
      type: "numberColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "remainingPrincipal",
      headerName: "Kalan Ana Para",
      type: "numberColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "remainingInstallmentAmount",
      headerName: "Kalan Taksit Tutarı",
      type: "numberColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "remainingInstallmentCount",
      headerName: "Kalan Taksit Sayısı",
      type: "numberColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "interestRate",
      headerName: "Faiz Oranı",
      type: "numberColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "totalInstallmentCount",
      headerName: "Toplam Taksit Sayısı",
      type: "numberColumn",
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
      cellEditorParams: {
        values: loanStatus.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = loanStatus.find((c) => c.code === value);
        return item?.name ?? value;
      },
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
      field: "project.name",
      headerName: "Proje",
      editable: false,
      minWidth: 200,
    },
    {
      field: "createdBy.email",
      headerName: "Oluşturan",
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
      field: "updatedBy.email",
      headerName: "Güncelleyen",
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
  ];

  const getRowId = (params: GetRowIdParams<LoansRows>) => {
    return params.data.id!;
  };

  const handleSuccess = (message?: string, newData?: LoansRows) => {
    if (message) {
      notify.success(message);
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
      addRow(newItem);
      notify.success("Kayıt başarıyla oluşturuldu");
    } else {
      const updatedItem = await update(formData);
      updateRow(updatedItem);
      notify.success("Değişiklikler kaydedildi");
    }
  };

  return (
    <>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <LoanTransactionModal
        open={modalOpen}
        mode={modalMode}
        defaultValues={editData}
        options={accountOptions}
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
        autoSelectRowOnClick={true}
        onRowClick={(row) => {
          onLoanSelected?.(row.id!);
        }}
        enableSelection={false}
        onDeleteRow={deleteRows}
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
