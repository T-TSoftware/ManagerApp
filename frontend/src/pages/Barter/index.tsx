"use client";
import { useState } from "react";
import BarterAgreementGrid from "./grid";
import BarterItemGrid from "./BarterItems/grid";

const BarterAgreement = () => {
  const [selectedBarterId, setSelectedBarterId] = useState<string | null>(null);
  return (
    <div className="grow p-3 lg:rounded-lg lg:shadow-xs h-full border-gray-100">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <p className="text-3xl font-semibold sm:text-3xl text-black dark:text-white">
            Barter 
          </p>
        </div>

        <div className="mt-8 overflow-x-auto whitespace-nowrap">
          <div className="flex flex-col min-w-full p-3 rounded-md shadow-xl h-[34rem] max-h-[60rem] 2xl:h-[60rem] bg-white dark:bg-tertiary">
            <BarterAgreementGrid
              onBarterSelected={(id) => setSelectedBarterId(id)}
            />
          </div>
        </div>

        <div className="mt-8 overflow-x-auto whitespace-nowrap">
          <p className="ml-4 text-lg font-semibold text-light_fourth dark:text-white">
            Anlaşmalar 
          </p>
          <div className="flex flex-col min-w-full p-3 rounded-md shadow-xl h-[34rem] max-h-[60rem] 2xl:h-[60rem] bg-white dark:bg-tertiary">
            <BarterItemGrid barterId={selectedBarterId!} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarterAgreement;
