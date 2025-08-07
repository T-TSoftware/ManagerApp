import { useEffect, useState } from "react";
import axios from "../utils/axios";
import type { AutocompleteOption } from "../types/grid/commonTypes";
import { getToken } from "../utils/token";

const categoryConfig: Record<
  string,
  { endpoint: string; responseKey?: string; project?: string }
> = {
  ORDER: { endpoint: "/orders", responseKey: "orders" },
  INTERNAL_TRANSFER: { endpoint: "/balances" },
  LOAN: { endpoint: "/loans", responseKey: "loans" },
  CHECK: { endpoint: "/checks", responseKey: "checks" },
  SUPPLIER: {
    endpoint: "/suppliers",
    responseKey: "suppliers",
    project: "yes",
  },
  BARTER: { endpoint: "/barters" },
  SUBCONTRACTOR: {
    endpoint: "/subcontractors",
    responseKey: "subcontractors",
    project: "yes",
  },
};

export const useReferenceOptions = (category: string | undefined, projectId: string | undefined) => {
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const token = getToken();

  useEffect(() => {
    if (!category || !categoryConfig[category]) {
      setOptions([]);
      return;
    }

    const fetchOptions = async () => {
      setLoading(true);
      try {
        const { endpoint, responseKey, project } = categoryConfig[category];
        const url = project ? `/projects/${projectId}${endpoint}` : endpoint;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        const rawData = response.data;
        console.log(rawData);
        console.log(responseKey);

        const list = responseKey ? rawData?.[responseKey] : rawData;
        console.log(list);
        if (!Array.isArray(list)) {
          setOptions([]);
          return;
        }

        const result = list.map((item: any) => ({
          code: item.code ?? item.id,
          name: item.name ?? item.code,
        }));
        console.log(result);
        setOptions(result);
      } catch (error) {
        console.error("Referans verisi alınamadı:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [category]);

  return { options, loading };
};
