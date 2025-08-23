import { useEffect, useState } from "react";
import { getAllUpcomingPayments, getEURCurrency, getUSDCurrency } from "./service";
import { getToken } from "../../utils/token";
import { UpcomingPaymentsRows } from "./type";


export const useDashboard = () => {
  const [eurRate, setEurRate] = useState<number | null>(null);
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPaymentsRows[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = getToken();

  useEffect(() => {
    const fetchRates = async () => {
        setLoading(true);
      try {
        const eur = await getEURCurrency();
        const usd = await getUSDCurrency();
        const payments = await getAllUpcomingPayments(token!);
        
        setEurRate(eur);
        setUsdRate(usd);
        setUpcomingPayments(payments);

      } catch (err) {
        setError("Kur bilgileri alınamadı.");
      }finally{
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  return { eurRate, usdRate, upcomingPayments, error, loading };
};