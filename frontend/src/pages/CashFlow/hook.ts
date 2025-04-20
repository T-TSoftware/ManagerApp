

import { useEffect, useState } from "react";
import { CashFlowRows } from "./types";

const mockCurrents: CashFlowRows[] = [
  {
    currentNo: 1,
    currentName: "Tuğçe Ece",
    receivableBalance: 64950,
    debtBalance: 1000,
    currency: "$",
  },
  {
    currentNo: 2,
    currentName: "Taylan Güloğlu",
    receivableBalance: 33850,
    debtBalance: 1000,
    currency: "$",
  },
  {
    currentNo: 3,
    currentName: "Deniz Güloğlu",
    receivableBalance: 29600,
    debtBalance: 1000,
    currency: "$",
  },
  {
    currentNo: 4,
    currentName: "Ali Cem Ece",
    receivableBalance: 48890,
    debtBalance: 1000,
    currency: "$",
  },
  {
    currentNo: 5,
    currentName: "Tuğba Ece",
    receivableBalance: 15774,
    debtBalance: 1000,
    currency: "$",
  },
  {
    currentNo: 6,
    currentName: "Nil Ece",
    receivableBalance: 20675,
    debtBalance: 1000,
    currency: "$",
  },
  {
    currentNo: 7,
    currentName: "Ali Cem Ece",
    receivableBalance: 48890,
    debtBalance: 1000,
    currency: "$",
  },
  {
    currentNo: 8,
    currentName: "Tuğba Ece",
    receivableBalance: 15774,
    debtBalance: 1000,
    currency: "$",
  },
  {
    currentNo: 9,
    currentName: "Nil Ece",
    receivableBalance: 20675,
    debtBalance: 1000,
    currency: "$",
  },
];

export const useCashFlow = () => {
  const [cashFlow, setCashFlow] = useState<CashFlowRows[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate API delay
    const timeout = setTimeout(() => {
      setCashFlow(mockCurrents);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return { cashFlow, loading };
};
