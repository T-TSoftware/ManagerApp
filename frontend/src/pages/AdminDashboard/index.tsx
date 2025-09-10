import React from "react";
import { useDashboard } from "./hook";
import { DollarSign, Euro } from "lucide-react";
import UpcomingPaymentsGrid from "./payment-grid";
import UpcomingCollectionsGrid from "./collection-grid";

const AdminDashboard: React.FC = () => {
  const { eurRate, usdRate } = useDashboard();

  return (
    <div className="grow p-3 lg:rounded-lg lg:shadow-xs h-full">
      <div className="mx-auto max-w-7xl h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3">
          <p className="text-3xl font-semibold sm:text-3xl dark:text-white">
            Admin Genel Bakış
          </p>
        </div>

        {/* Main Grid alanı */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 h-[calc(100vh-160px)]">
          {/* Sol kolon */}
          <div className="flex flex-col gap-4 h-full">
            {/* Üst iki küçük kutu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div className="bg-white dark:bg-black rounded-2xl p-4 flex flex-col">
                <p className="font-bold dark:text-white mb-3">Para Piyasa</p>
                <div className="bg-red-50 dark:bg-red-100 rounded-xl p-4 mb-4 flex-1">
                  <p className="text-sm text-gray-500 mb-1">EUR/TRY</p>
                  <div className="text-2xl font-bold text-black flex items-center justify-between">
                    <Euro />
                    <span>₺{eurRate ? eurRate.toFixed(2) : "..."}</span>
                    <span className="text-lg">↗</span>
                  </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-100 rounded-xl p-4 flex-1">
                  <p className="text-sm text-gray-500 mb-1">USD/TRY</p>
                  <div className="text-2xl font-bold text-black flex items-center justify-between">
                    <DollarSign />
                    <span>₺{usdRate ? usdRate.toFixed(2) : "..."}</span>
                    <span className="text-lg">↗</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-black rounded-2xl p-4 flex-1">
                {/* Sol üst sağ kutu */}?
              </div>
            </div>

            {/* Alt kutu: Collections grid */}
            <div className="bg-white dark:bg-black rounded-2xl p-4 flex-1 overflow-hidden">
              <UpcomingCollectionsGrid />
            </div>
          </div>

          {/* Sağ kolon: Payments grid */}
          <div className="bg-white dark:bg-black rounded-2xl p-4 flex-1 overflow-hidden">
            <UpcomingPaymentsGrid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
