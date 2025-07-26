import React from "react";
import { useCurrencyRates } from "./hook";
import { DollarSign, Euro } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { eurRate, usdRate, error } = useCurrencyRates();
  
  return (
    <div className="grow p-3 lg:rounded-lg lg:shadow-xs h-full">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3">
          <p className="text-3xl font-semibold sm:text-3xl dark:text-white">
            Admin Genel Bakış
          </p>
          <div className="flex flex-wrap gap-2">
            <button className="bg-white dark:bg-black px-4 py-2 rounded-full">
              Date: Now
            </button>
            <button className="bg-white dark:bg-black px-4 py-2 rounded-full">
              Product: All
            </button>
            <button className="bg-white dark:bg-black px-4 py-2 rounded-full">
              Profile: Bogdan
            </button>
          </div>
        </div>
        {/* Main Grid */}
        <div className="flex flex-1 flex-col lg:flex-row gap-4 h-[calc(100vh-160px)]">
          {/* Left Column */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div className="bg-white dark:bg-black rounded-2xl p-4 flex-1">
                <p className="font-bold dark:text-white mb-3">Para Piyasa</p>
                <div className="bg-red-50 dark:bg-red-100 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">EUR/TRY</p>
                  <div className="text-2xl font-bold text-black flex items-center justify-between">
                    <span>
                      {" "}
                      <Euro></Euro>
                    </span>
                    <span>₺{eurRate ? eurRate.toFixed(2) : "..."}</span>
                    <span className="text-lg">↗</span>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-100 rounded-xl p-4 mt-4">
                  <p className="text-sm text-gray-500 mb-1">USD/TRY</p>
                  <div className="text-2xl font-bold text-black flex items-center justify-between">
                    <span>
                      <DollarSign></DollarSign>
                    </span>
                    <span>₺{usdRate ? usdRate.toFixed(2) : "..."}</span>
                    <span className="text-lg">↗</span>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-black rounded-2xl p-4 flex-1">
                Product
              </div>
            </div>
            <div className="bg-white dark:bg-black rounded-2xl p-4 flex-1">
              Product Chart
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-white dark:bg-black rounded-2xl p-4 flex-1">
            Projects Timeline
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


