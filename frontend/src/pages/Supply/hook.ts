import { useEffect, useState } from "react";
import { SupplyRows } from "./supply.types";
import { getAllSupplies } from "./service";
import { useApp } from "../../hooks/useApp";

/*const mockCurrents: SupplyRows[] = [
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
      currentName: "Tuğba Ece",
      receivableBalance: 15774,
      debtBalance: 1000,
      currency: "$",
    },
    {
      currentNo: 8,
      currentName: "Nil Ece",
      receivableBalance: 20675,
      debtBalance: 1000,
      currency: "$",
    },
];
*/
export const useSupply = () => {
  const [supplies, setSupplies] = useState<SupplyRows[]>([]);
  const [loading, setLoading] = useState(true);
  const {companyId} = useApp();
  
  useEffect(() => {
    if (!companyId) return;
    getAllSupplies(companyId)
      .then(setSupplies)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [companyId]);

  return { supplies, loading };
};
