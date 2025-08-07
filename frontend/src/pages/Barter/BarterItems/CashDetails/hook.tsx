import { useEffect, useRef, useState } from "react";
import { isRowModified } from "../../../../types/grid/commonTypes";
import { BaseGridHandle } from "../../../../components/grid/BaseGrid";
import { useNotifier } from "../../../../hooks/useNotifier";
import { v4 as uuid } from "uuid";
import { getCashDetails} from "./service";
import type { BarterItemCashDetailRows } from "./types";

import { getToken } from "../../../../utils/token";


export const useCashDetails = (barterItemId: string) => {

  const [localData, setLocalData] = useState<BarterItemCashDetailRows[]>([]);
  const [loading, setLoading] = useState(false);

  const gridRef = useRef<BaseGridHandle<BarterItemCashDetailRows>>(null);

  const token = getToken();
  const notify = useNotifier();
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getCashDetails(token!,barterItemId);
      setLocalData(data);
    } catch (e) {
      notify.handleError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (barterItemId) fetchData();
  }, [barterItemId]);


  return {
    localData,
    loading,
    gridRef,
  };
};