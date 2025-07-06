import React from "react";
import StockGrid from "./grid";
import Alert from "../../components/feedback/Alert";

const ProjectStock: React.FC = () => {
  return (
    <div className="grow p-3 lg:rounded-lg lg:shadow-xs h-full border-gray-100">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <p className="text-3xl font-semibold sm:text-3xl text-black dark:text-white">
            Stok Durumu
          </p>
        </div>
        <div className="flow-root">
          <div className="mt-8 overflow-x-auto whitespace-nowrap ">
            <div className="flex flex-col min-w-full p-3 rounded-md shadow-xl h-[34rem] max-h-[60rem] 2xl:h-[60rem] bg-white dark:bg-tertiary">
              <div className="mb-2">
                <Alert />
              </div>
              <StockGrid />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStock;
