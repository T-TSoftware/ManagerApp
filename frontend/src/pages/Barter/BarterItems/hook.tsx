import { useState, useEffect } from "react";
import {
  getBarterItemsById,
  addBarterItem,
  updateBarterItem,
  deleteBarterItem,
} from "./service";
import type { BarterItemRows } from "./types";
import { getToken } from "../../../utils/token";

export const useBarterItem = (barterId: string | null) => {
  const [barterItems, setBarterItems] = useState<BarterItemRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const token = getToken();

  useEffect(() => {
    if (barterId) fetchItems();
  }, [barterId]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const result = await getBarterItemsById(token!, barterId!);
      setBarterItems(result);
    } catch (err) {
      setAlert({ message: "Barter item verileri yüklenemedi", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: Partial<BarterItemRows>) => {
    const newItem = await addBarterItem(token!, data, barterId!);
    setBarterItems((prev) => [newItem, ...prev]);
  };

  const update = async (data: Partial<BarterItemRows>) => {
    const updatedItem = await updateBarterItem(token!, data);
    setBarterItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const remove = async (selected: BarterItemRows[]) => {
    try {
      const record = selected[0];
      await deleteBarterItem(token!, record.id!);
      setBarterItems((prev) => prev.filter((r) => r.id !== record.id));
      setAlert({ message: "Silme işlemi başarılı", type: "success" });
    } catch (err) {
      setAlert({ message: "Silme işlemi başarısız", type: "error" });
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
