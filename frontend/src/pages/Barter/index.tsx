"use client";
import { useState } from "react";
import BarterAgreementGrid from "./grid";
import BarterItemGrid from "./BarterItems/grid";

const BarterAgreement = () => {
  const [selectedBarterId, setSelectedBarterId] = useState<string | null>(null);
  const [selectedBarterProjectId, setSelectedBarterProjectId] = useState<
    string | null
  >(null);
  return (
    <div className="h-full grow">
      <div className="mx-auto max-w-7xl p-3 lg:px-4">
        {/* Page Header */}
        <div className="flex items-end justify-between gap-4 pt-3">
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Barter
          </h1>
        </div>

        {/* Loans Panel */}
        <section className="mt-6">
          <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-tertiary shadow-sm p-2 sm:p-4 overflow-hidden h-[34rem] max-h-[60rem] 2xl:h-[60rem]">
            <BarterAgreementGrid
              onBarterSelected={(id) => setSelectedBarterId(id)}
              onBarterProjectSelected={(id) => setSelectedBarterProjectId(id)}
            />
          </div>
        </section>

        {/* Payments Header */}
        <div className="mt-8 mb-6">
          <p className="text-lg font-semibold text-light_fourth dark:text-white">
            Anlaşmalar
          </p>
        </div>

        {/* Payments Panel */}
        <section className="mt-3">
          <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-tertiary shadow-sm p-2 sm:p-4 overflow-hidden h-[34rem] max-h-[60rem] 2xl:h-[60rem]">
            {selectedBarterId ? (
              <BarterItemGrid barterId={selectedBarterId!} projectId={selectedBarterProjectId!}/>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-300">
                Lütfen üst listeden bir kredi seçin.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BarterAgreement;
