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
  CellValueChangedEvent
} from "ag-grid-community";
import ActionButton from "./ActionButton";
import {
  PlusIcon,
  TrashIcon,
  BookmarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../../themes/appThemes/ThemeContext";

ModuleRegistry.registerModules([AllCommunityModule]);

// Ref tipi
export type BaseGridHandle<T> = {
  addRow: (row: T) => void;
  deleteSelectedRows: () => void;
  onCellValueChanged?: (e: CellValueChangedEvent<T>) => void;
};

// Props tipi
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
  showButtons?: {
    bar?: boolean;
    refresh?: boolean;
    add?: boolean;
    delete?: boolean;
    save?: boolean;
  };
  onCellValueChanged?: (e: CellValueChangedEvent<T>) => void;
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
    topLeftButton,
    showButtons = { refresh: true, add: true, delete: true, save: true },
    onCellValueChanged,
  }: BaseGridProps<T>,
  ref: Ref<BaseGridHandle<T>>
) => {
  const gridApi = useRef<GridApi | null>(null);

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
          <div className="w-55 flex-auto"></div>
          <div className="flex flex-row flex-auto w-45 align-middle justify-end gap-1 ">
            {showButtons.refresh && (
              <ActionButton
                icon={<ArrowPathIcon />}
                label="Yenile"
                onClick={() => location.reload()}
              />
            )}
            {showButtons.add && onAddRow && (
              <ActionButton
                icon={<PlusIcon />}
                label="Kayıt Ekle"
                onClick={onAddRow}
              />
            )}
            {showButtons.delete && onDeleteRow && (
              <ActionButton
                icon={<TrashIcon />}
                label="Kayıt Sil"
                onClick={handleDelete}
              />
            )}
            {showButtons.save && onSaveChanges && (
              <ActionButton
                icon={<BookmarkIcon />}
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
          defaultColDef={{ editable: true, flex: 1, filter: true }}
          theme={agGridThemeObject}
          pagination={true}
          rowSelection="multiple" 
          cellSelection={true}
          getRowId={getRowId}
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
          rowMultiSelectWithClick={true}
        />
      </div>
    </div>
  );
};

const BaseGrid = forwardRef(BaseGridInner) as <T>(
  props: BaseGridProps<T> & { ref?: Ref<BaseGridHandle<T>> }
) => ReturnType<typeof BaseGridInner>;

export default BaseGrid;
