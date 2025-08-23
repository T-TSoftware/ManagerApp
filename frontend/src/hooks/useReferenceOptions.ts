// hooks/useReferenceOptions.ts
import { useEffect, useRef, useState } from "react";
import axios from "../utils/axios";
import type { AutocompleteOption } from "../types/grid/commonTypes";
import { getToken } from "../utils/token";

const categoryConfig: Record<
  string,
  { endpoint: string; responseKey?: string; project?: boolean }
> = {
  ORDER: { endpoint: "/orders", responseKey: "orders" },
  INTERNAL_TRANSFER: { endpoint: "/balances" },
  LOAN: { endpoint: "/loan-payments", responseKey: "loanPayments" },
  CHECK: { endpoint: "/checks", responseKey: "checks" },
  SUPPLIER: { endpoint: "/suppliers", responseKey: "suppliers", project: true },
  BARTER: { endpoint: "/barter-items" },
  SUBCONTRACTOR: {
    endpoint: "/subcontractors",
    responseKey: "subcontractors",
    project: true,
  },
  STOCK: { endpoint: "/stocks" },
};

export const useReferenceOptions = (
  category: string | undefined,
  projectId: string | undefined
) => {
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const token = getToken();

  // ✅ En son isteği işaretlemek için anahtar
  const lastKeyRef = useRef<string>("");

  useEffect(() => {
    if (!category || !categoryConfig[category]) {
      setOptions([]);
      return;
    }

    const { endpoint, responseKey, project } = categoryConfig[category];

    // ✅ Proje zorunluysa ve projectId yoksa fetch etme
    if (project && !projectId) {
      setOptions([]);
      return;
    }

    const url = project ? `/projects/${projectId}${endpoint}` : endpoint;

    // ✅ Bu efekt için anahtar
    const key = `${category}|${project ? projectId ?? "-" : "-"}`;
    lastKeyRef.current = key;

    // (opsiyonel) eski isteği iptal etmek için AbortController
    const controller = new AbortController();
    let cancelled = false;

    const fetchOptions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        const raw = response.data;
        const list = responseKey ? raw?.[responseKey] : raw;

        if (!Array.isArray(list)) {
          if (!cancelled && lastKeyRef.current === key) setOptions([]);
          return;
        }

        const mapped: AutocompleteOption[] = list.map((item: any) => ({
          code: item.code ?? item.id,
          name: item.name ?? item.code ?? String(item.id),
        }));

      
        if (!cancelled && lastKeyRef.current === key) {
          setOptions(mapped);
        }
      } catch (err) {
        if (!cancelled && lastKeyRef.current === key) {
          setOptions([]);
        }
      } finally {
        if (!cancelled && lastKeyRef.current === key) setLoading(false);
      }
    };

    fetchOptions();

    return () => {
      cancelled = true;
      controller.abort(); 
    };
  }, [category, projectId, token]);

  return { options, loading };
};

export const useStockOptions = (projectId?: string) =>
  useReferenceOptions("STOCK", projectId);

export const useSupplierOptions = (projectId?: string) =>
  useReferenceOptions("SUPPLIER", projectId);

export const useSubcontractorOptions = (projectId?: string) =>
  useReferenceOptions("SUBCONTRACTOR", projectId);
