import React from "react";
import BalanceGrid from "./grid";
import Alert from "../../components/feedback/Alert";

const Balances: React.FC = () => {
  return (
    <div className="h-full grow">
      <div className="mx-auto max-w-7xl p-3 lg:px-4">
        <div className="flex items-end justify-between gap-4 pt-3">
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Hesap Bakiyeleri
          </h1>
        </div>
        <section className="mt-6">
          <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-tertiary shadow-sm p-2 sm:p-4 overflow-hidden h-[34rem] max-h-[60rem] 2xl:h-[60rem]">
            <BalanceGrid />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Balances;
