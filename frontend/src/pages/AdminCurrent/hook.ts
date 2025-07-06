import { useEffect, useState, useRef } from "react";
import { CurrentRows } from "./types";
import { useParams } from "react-router-dom";
import {
  getAllCurrents,
} from "./service";
import { useNotifier } from "../../hooks/useNotifier";
import { getToken } from "../../utils/token";
import { BaseGridHandle } from "../../components/grid/BaseGrid";

export const useCurrent = () => {
  const [localData, setlocalData] = useState<CurrentRows[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<BaseGridHandle<CurrentRows>>(null);

  const token = getToken();
  const notify = useNotifier();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllCurrents(token!);    
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
    gridRef
  };
};
