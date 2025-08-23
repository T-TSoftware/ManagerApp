// Ortak tarih tipi
export type BaseGridDate = string | Date | null;

export interface BaseGridRow {
  id?: string;
  createdBy: string;
  updatedBy: string;
  createdatetime: BaseGridDate;
  updatedatetime: BaseGridDate;
  isNew?: boolean;
  _originalData?: unknown;
}

export interface FinancialGridRow extends BaseGridRow {
  unitPrice: number;
  quantity: number;
  contractAmount: number;
  paidAmount: number;
  remainingAmount: number;
}

export interface ValidationFields<T> {
  [key: string]: string;
}

export interface AutocompleteOption {
  code: string;
  name: string;
}

export interface AutocompleteOptionById {
  id: string;
  name: string;
}
// Yardımcı: tarihi normalize edip ISO string veya null döner
const toISO = (v: BaseGridDate): string | null => {
  if (v == null || v === "") return null;
  const d = v instanceof Date ? v : new Date(String(v));
  return isNaN(+d) ? null : d.toISOString();
};

/**
 * Satırın orijinal snapshot'a göre değişip değişmediğini kontrol eder.
 * - _originalData yoksa false döner
 * - tarih alanları normalize edilerek karşılaştırılır
 * - diğer alanlar JSON.stringify ile kıyaslanır
 */
export const isRowModified = <T extends BaseGridRow>(row: T): boolean => {
  if (!row._originalData) return false;
  const original = row._originalData as T;

  // Önce tarih alanlarını özel olarak kontrol et
  if (toISO(row.createdatetime) !== toISO(original.createdatetime)) return true;
  if (toISO(row.updatedatetime) !== toISO(original.updatedatetime)) return true;

  // Diğer alanları shallow JSON karşılaştırması ile kontrol et
  const {
    _originalData: _,
    isNew: __,
    createdatetime: ___,
    updatedatetime: ____,
    ...currentRest
  } = row;
  const {
    _originalData: _o,
    isNew: _io,
    createdatetime: _co,
    updatedatetime: _uo,
    ...originalRest
  } = original;

  return JSON.stringify(currentRest) !== JSON.stringify(originalRest);
};
