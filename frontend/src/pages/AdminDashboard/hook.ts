import { useEffect, useState } from "react";
import { getEURCurrency, getUSDCurrency } from "./service";


export const useCurrencyRates = () => {
  const [eurRate, setEurRate] = useState<number | null>(null);
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const eur = await getEURCurrency();
        const usd = await getUSDCurrency();
        console.log("eur",eur)
        setEurRate(eur);
        setUsdRate(usd);
      } catch (err) {
        setError("Kur bilgileri alınamadı.");
      }
    };

    fetchRates();
  }, []);

  return { eurRate, usdRate, error };
};