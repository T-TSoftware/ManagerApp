"use client";
import React, { useRef, useImperativeHandle, forwardRef, Ref } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  GridApi,
  ColDef,
  GetRowIdParams,
  RowSelectionOptions,
  CellValueChangedEvent,
} from "ag-grid-community";
import ActionButton from "./ActionButton";
import {
  BadgePlus,
  BookMarked,
  CirclePlus,
  ListRestart,
  Trash2,
} from "lucide-react";
import { useTheme } from "../../themes/appThemes/ThemeContext";
import { AgGridLocaleTR } from "../../utils/AgGridLocaleTR";
import { ColumnTypes } from "../../types/grid/ColumnTypes";

ModuleRegistry.registerModules([AllCommunityModule]);

export type BaseGridHandle<T> = {
  addRow: (row: T) => void;
  deleteSelectedRows: () => void;
  onCellValueChanged?: (e: CellValueChangedEvent<T>) => void;
  getGridApi: () => GridApi | null;
};

type BaseGridProps<T> = {
  rowData: T[];
  columnDefs: ColDef<T>[];
  getRowId: (params: GetRowIdParams<T>) => string;
  onAddRow?: () => void;
  onDeleteRow?: (selectedRows: T[]) => void;
  onSaveChanges?: (allRows: T[]) => void;
  isLoading?: boolean;
  topLeftButton?: {
    icon: React.ReactNode;
    label: string;
    options?: { label: string; onClick: () => void }[];
  };
  title?: string;
  showButtons?: {
    bar?: boolean;
    refresh?: boolean;
    add?: boolean;
    delete?: boolean;
    save?: boolean;
  };
  onRowClick?: (row: T) => void;
  RowSelectionOptions?: (e: RowSelectionOptions<T>) => void;
  onCellValueChanged?: (e: CellValueChangedEvent<T>) => void;
  onOpenCreateModal?: () => void;
  enableSelection?: boolean;
  autoSelectRowOnClick?: boolean;
};

const BaseGridInner = <T,>(
  {
    rowData,
    columnDefs,
    getRowId,
    onAddRow,
    onDeleteRow,
    onSaveChanges,
    isLoading = false,
    title,
    topLeftButton,
    showButtons = {
      refresh: true,
      add: true,
      delete: true,
      save: true
    },
    onCellValueChanged,
    RowSelectionOptions,
    onOpenCreateModal,
    onRowClick,
    enableSelection = true,
    autoSelectRowOnClick,
  }: BaseGridProps<T>,
  ref: Ref<BaseGridHandle<T>>
) => {
  const gridApi = useRef<GridApi | null>(null);

  const rowSelection: RowSelectionOptions = {
    mode: "multiRow",
    checkboxes: enableSelection ?? true,
    headerCheckbox: enableSelection ?? true,
    copySelectedRows: true,
    enableClickSelection: enableSelection ?? true,
    enableSelectionWithoutKeys: enableSelection ?? true,
  };

  const onGridReady = (params: { api: GridApi }) => {
    gridApi.current = params.api;
  };

  const handleDelete = () => {
    const selected = gridApi.current?.getSelectedRows() || [];
    if (selected.length > 0 && onDeleteRow) onDeleteRow(selected as T[]);
    else alert("Lütfen silinecek satırları seçiniz.");
  };

  const handleSave = () => {
    if (!onSaveChanges) return;
    const allRows: T[] = [];
    gridApi.current?.forEachNode((node) => allRows.push(node.data));
    onSaveChanges(allRows);
  };

  useImperativeHandle(ref, () => ({
    addRow: (row: T) => {
      gridApi.current?.applyTransaction({ add: [row], addIndex: 0 });
    },
    deleteSelectedRows: () => {
      const selected = gridApi.current?.getSelectedRows();
      if (selected && selected.length > 0) {
        gridApi.current?.applyTransaction({ remove: selected });
      }
    },
    getGridApi: () => gridApi.current,
  }));
  const { agGridThemeClass, agGridThemeObject } = useTheme();
  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {showButtons.bar && (
        <div className="flex gap-2 py-2 px-2 dark:bg-fifth shadow-md ring-1  ring-zinc-950/5 rounded-lg dark:ring-white/10 w-full">
          {topLeftButton && (
            <div className="w-15 flex-none">
              <ActionButton
                icon={topLeftButton.icon}
                label={topLeftButton.label}
                isDropdown={!!topLeftButton.options}
                options={topLeftButton.options}
              />
            </div>
          )}
          {title && (
            <div className="w-15 flex-none">
              <p className="align-middle font-bold dark:text-white">{title}</p>
            </div>
          )}
          <div className="w-55 flex-auto"></div>
          <div className="flex flex-row flex-auto w-45 align-middle justify-end gap-1 ">
            {showButtons.refresh && (
              <ActionButton
                icon={<ListRestart size={20} strokeWidth={1.75} />}
                label="Yenile"
                onClick={() => location.reload()}
              />
            )}
            {showButtons.add && (
              <ActionButton
                icon={<CirclePlus size={20} strokeWidth={1.75} />}
                label="Kayıt Ekle"
                onClick={() => {
                  if (onAddRow) {
                    onAddRow();
                  } else if (onOpenCreateModal) {
                    onOpenCreateModal();
                  }
                }}
              />
            )}
            {showButtons.delete && onDeleteRow && (
              <ActionButton
                icon={<Trash2 size={20} strokeWidth={1.75} />}
                label="Kayıt Sil"
                onClick={handleDelete}
              />
            )}
            {showButtons.save && onSaveChanges && (
              <ActionButton
                icon={<BookMarked size={20} strokeWidth={1.75} />}
                label="Kaydet"
                onClick={handleSave}
              />
            )}
          </div>
        </div>
      )}

      <div className={`${agGridThemeClass} w-full h-full rounded-lg shadow-lg`}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          columnTypes={ColumnTypes}
          defaultColDef={{ flex: 1, filter: true }}
          theme={agGridThemeObject}
          pagination={true}
          paginationAutoPageSize={true}
          paginationPageSize={100}
          onRowClicked={(e) => {
            if (autoSelectRowOnClick) {
              const api = e.api;
              api.deselectAll();
              e.node.setSelected(true);
            }
            if (e.data && onRowClick) {
              onRowClick(e.data);
            }
          }}
          rowSelection={rowSelection}
          getRowId={getRowId}
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
          localeText={AgGridLocaleTR}
        />
      </div>
    </div>
  );
};

const BaseGrid = forwardRef(BaseGridInner) as <T>(
  props: BaseGridProps<T> & { ref?: Ref<BaseGridHandle<T>> }
) => ReturnType<typeof BaseGridInner>;

export default BaseGrid;
