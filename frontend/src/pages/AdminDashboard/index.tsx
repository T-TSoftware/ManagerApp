import React from "react";
import DashboardGrid from "../Dashboard/grid";

const AdminDashboard: React.FC = () => {
  
  return (
    <div className="grow p-3 lg:rounded-lg lg:shadow-xs h-full border-gray-100">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3">
          <p className="text-3xl font-semibold sm:text-3xl dark:text-white">
            Admin Genel Bakış
          </p>
          <div className="flex flex-wrap gap-2">
            <button className="bg-gray-200 dark:bg-black px-4 py-2 rounded-full">
              Date: Now
            </button>
            <button className="bg-gray-200 dark:bg-black px-4 py-2 rounded-full">
              Product: All
            </button>
            <button className="bg-gray-200 dark:bg-black px-4 py-2 rounded-full">
              Profile: Bogdan
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-green-200 min-h-screen">
          {/* Left Column */}
          <div className="space-y-4 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-1/4">
              <div className="bg-gray-100 dark:bg-black rounded-2xl p-4">
                Customer
              </div>
              <div className="bg-gray-100 dark:bg-black rounded-2xl p-4">
                Product
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-black rounded-2xl p-4 h-3/4">
              Product Chart
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-gray-100 dark:bg-black rounded-2xl p-4 h-3/4">
            Projects Timeline
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


