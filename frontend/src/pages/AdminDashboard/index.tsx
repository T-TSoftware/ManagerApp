import React from "react";
import DashboardGrid from "../Dashboard/grid";

const AdminDashboard: React.FC = () => {
  
  return (
    <div className="grow p-3 lg:rounded-lg lg:shadow-xs h-full border-gray-100">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-4">
          <p className="text-3xl font-semibold sm:text-3xl text-black dark:text-white">
            Admin Genel Bakış
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 py-2">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-xl shadow h-[190px] w-full">
              <div className="bg-yellow-400 text-black rounded-xl p-4 flex flex-col justify-between">
                <div className="text-sm font-medium">Pending withdrawals</div>
                <div className="text-2xl font-bold">$1,200</div>
                <button className="mt-2 bg-black text-white text-sm px-3 py-1 rounded-full">
                  Cashout
                </button>
              </div>
              <div className="bg-gray-900 text-white rounded-xl p-4 flex flex-col justify-between">
                <div className="text-sm font-medium">Daily transactions</div>
                <div className="text-2xl font-bold">43</div>
                <button className="mt-2 bg-gray-700 text-white text-sm px-3 py-1 rounded-full">
                  Activity
                </button>
              </div>
              <div className="bg-gray-200 text-black rounded-xl p-4 flex flex-col justify-between">
                <div className="text-sm font-medium">Exchange fees paid</div>
                <div className="text-2xl font-bold">$45.70</div>
                <button className="mt-2 bg-white text-black text-sm px-3 py-1 rounded-full border">
                  Fees
                </button>
              </div>
            </div>
            <div className="dark:bg-white rounded-xl shadow p-4 w-full h-full">
              <DashboardGrid />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="dark:bg-white rounded-xl shadow h-[350px] w-full"></div>
            <div className="dark:bg-black dark:text-white rounded-xl shadow h-[250px] w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


