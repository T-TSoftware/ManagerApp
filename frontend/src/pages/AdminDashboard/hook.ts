import { useEffect, useState } from "react";
import { getAllUpcomingCollections, getAllUpcomingPayments, getEURCurrency, getUSDCurrency } from "./service";
import { getToken } from "../../utils/token";
import { UpcomingCollectionsRows, UpcomingPaymentsRows } from "./type";


export const useDashboard = () => {
  const [eurRate, setEurRate] = useState<number | null>(null);
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPaymentsRows[]>([]);
  const [upcomingCollections, setUpcomingCollections] = useState<UpcomingCollectionsRows[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = getToken();

  useEffect(() => {
    const fetchRates = async () => {
        setLoading(true);
      try {
        const eur = await getEURCurrency();
        const usd = await getUSDCurrency();
        const payments = await getAllUpcomingPayments(token!);
        const collections = await getAllUpcomingCollections(token!);
        
        setEurRate(eur);
        setUsdRate(usd);
        setUpcomingPayments(payments);
        setUpcomingCollections(collections);

      } catch (err) {
        setError("Kur bilgileri alınamadı.");
      }finally{
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  return { eurRate, usdRate, upcomingPayments, upcomingCollections, error, loading };
};