import { useEffect, useState } from "react";
import { DashboardRows } from "./types";

const mockCurrents: DashboardRows[] = [
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

export const useDashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardRows[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate API delay
    const timeout = setTimeout(() => {
      setDashboard(mockCurrents);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return { dashboard, loading };
};
