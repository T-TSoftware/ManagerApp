"use client";
import { useRef, useState } from "react";
import BaseGrid, { BaseGridHandle } from "../../../components/grid/BaseGrid";
import type {
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
} from "ag-grid-community";
import { HandCoins } from "lucide-react";
import Alert from "../../../components/feedback/Alert";
import BarterItemModal from "./modal";
import { useBarterItem } from "./hook";
import type { BarterItemRows } from "./types";
import { useNotifier } from "../../../hooks/useNotifier";
import CashDetailsModal from "./CashDetails/modal";
import { barterItemType } from "../../../constants/barterItemType";
import { direction } from "../../../constants/direction";
import { checkStatus } from "../../../constants/checkStatus";

type Props = {
  barterId: string;
};

const BarterItemGrid = ({ barterId }: Props) => {
  const { barterItems, loading, alert, setAlert, create, update, remove } =
    useBarterItem(barterId);

  const baseGridRef = useRef<BaseGridHandle<BarterItemRows>>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [cashDetailsOpen, setCashDetailsOpen] = useState(false);
  const [cashDetailsItemId, setCashDetailsItemId] = useState<
    string | undefined
  >();
  const [editData, setEditData] = useState<
    Partial<BarterItemRows> | undefined
  >();
  const notify = useNotifier();

  const colDefs: ColDef<BarterItemRows>[] = [
/*     {
      headerName: "",
      field: "edit",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<BarterItemRows>) => {
        return (
          <button
            className="text-black hover:underline text-sm"
            onClick={() => {
              setEditData(params.data);
              setModalMode("edit");
              setModalOpen(true);
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
    {
      headerName: "",
      field: "cashDetails",
      pinned: "left",
      width: 60,
      editable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (params: ICellRendererParams<BarterItemRows>) => {
        const { itemType, id } = params.data || {};
        const isDisabled = !id || itemType !== "CASH";

        return (
          <button
            disabled={isDisabled}
            className={`text-black hover:underline text-sm disabled:opacity-40 disabled:cursor-not-allowed`}
            onClick={() => {
              setCashDetailsItemId(id);
              setCashDetailsOpen(true);
            }}
          >
            <HandCoins
              aria-hidden="true"
              className="size-5 text-yellow-500 dark:text-white"
            />
          </button>
        );
      },
    },
    { field: "id", hide: true },
    {
      field: "assetDetails",
      hide: true,
    },
    {
      field: "code",
      headerName: "Kod",
      editable: false,
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "Durum",
      cellEditorParams: {
        values: checkStatus.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = checkStatus.find((c) => c.code === value);
        return item?.name ?? value;
      },
      editable: false,
      minWidth: 200,
    },
    {
      field: "direction",
      headerName: "Girdi/Çıktı",
      cellEditorParams: {
        values: direction.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = direction.find((c) => c.code === value);
        return item?.name ?? value;
      },
      editable: false,
      minWidth: 200,
    },
    {
      field: "itemType",
      headerName: "Tür",
      cellEditorParams: {
        values: barterItemType.map((c) => c.code),
      },
      valueFormatter: ({ value }) => {
        const item = barterItemType.find((c) => c.code === value);
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
      field: "agreedValue",
      headerName: "Parasal Karşılık",
      type: "numberColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "remainingAmount",
      headerName: "Kalan Ödeme",
      type: "numberColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "processedAmount",
      headerName: "İşlenen Ödeme",
      type: "numberColumn",
      editable: false,
      minWidth: 200,
    },
    {
      field: "relatedStock",
      headerName: "İlişkili Stok",
      editable: false,
      minWidth: 200,
    },
    {
      field: "relatedSubcontractor",
      headerName: "İlişkili Taşeron İşi",
      editable: false,
      minWidth: 200,
    },
    {
      field: "relatedSupplier",
      headerName: "İlişkili Tedarik",
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
  ];

  const getRowId = (params: GetRowIdParams<BarterItemRows>) => {
    return params.data.id!;
  };

  const handleModalSubmit = async (formData: Partial<BarterItemRows>) => {
    try {
      if (modalMode === "create") {
        await create({ ...formData, id: undefined });
      } else {
        await update(formData);
      }
    } catch (err) {
      notify.error("Bir sorun oluştu.");
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <BarterItemModal
        open={modalOpen}
        mode={modalMode}
        defaultValues={editData}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
      {cashDetailsItemId && (
        <CashDetailsModal
          open={cashDetailsOpen}
          onClose={() => setCashDetailsOpen(false)}
          barterItemId={cashDetailsItemId}
        />
      )}

      <BaseGrid<BarterItemRows>
        ref={baseGridRef}
        rowData={barterItems}
        columnDefs={colDefs}
        getRowId={getRowId}
        onOpenCreateModal={() => {
          setModalMode("create");
          setEditData(undefined);
          setModalOpen(true);
        }}
        onDeleteRow={remove}
        isLoading={loading}
        showButtons={{
          refresh: true,
          add: true,
          delete: false,
          save: false,
          bar: true,
        }}
        enableSelection={false}
      />
    </>
  );
};

export default BarterItemGrid;
