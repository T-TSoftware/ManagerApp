
import { useEffect, useState, useRef } from "react";
import { CashFlowRows } from "./types";
import { useNotifier } from "../../hooks/useNotifier";
import { getToken } from "../../utils/token";
import { BaseGridHandle } from "../../components/grid/BaseGrid";
import { getAllCashFlows } from "./service";



export const useCashFlow = () => {
  const [localData, setlocalData] = useState<CashFlowRows[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<BaseGridHandle<CashFlowRows>>(null);

  const token = getToken();
  const notify = useNotifier();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllCashFlows(token!);
      setlocalData(data);
    } catch (error) {
      notify.handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return {
    localData,
    loading,
    gridRef,
  };
};

