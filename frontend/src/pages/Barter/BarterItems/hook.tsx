import { useState, useEffect } from "react";
import {
  getBarterItemsById,
  addBarterItem,
  updateBarterItem,
  deleteBarterItem,
} from "./service";
import type { BarterItemRows } from "./types";
import { getToken } from "../../../utils/token";
import { extractApiError } from "../../../utils/axios";
import { useNotifier } from "../../../hooks/useNotifier";

export const useBarterItem = (barterId: string | null, projectId: string | null,) => {
  const [barterItems, setBarterItems] = useState<BarterItemRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const notify = useNotifier();
  const token = getToken();

  useEffect(() => {
    if (barterId) fetchItems();
  }, [barterId, projectId]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const result = await getBarterItemsById(token!, barterId!);
      setBarterItems(result);
    } catch (error) {
      // Liste hatasını burada göstermek OK
      const { errorMessage } = extractApiError(error);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

const create = async (data: Partial<BarterItemRows>) => {
  try {
    const newItem = await addBarterItem(token!, data, barterId!);
    setBarterItems((prev) => [newItem, ...prev]);
  } catch (error) {
    const { errorMessage } = extractApiError(error);
    throw new Error(errorMessage); 
  }
};

const update = async (data: Partial<BarterItemRows>) => {
  try {
    const updatedItem = await updateBarterItem(token!, data);
    setBarterItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  } catch (error) {
    const { errorMessage } = extractApiError(error);
    throw new Error(errorMessage); 
  }
};

  const remove = async (selected: BarterItemRows[]) => {
    try {
      const record = selected[0];
      await deleteBarterItem(token!, record.id!);
      setBarterItems((prev) => prev.filter((r) => r.id !== record.id));
    } catch (error) {
      const { errorMessage } = extractApiError(error);
      throw new Error(errorMessage);
    }
  };

  return {
    barterItems,
    loading,
    alert,
    setAlert,
    create,
    update,
    remove,
  };
};
