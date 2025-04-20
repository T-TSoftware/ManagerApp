import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mobileSidebarRef = useRef<HTMLDivElement>(null);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSidebarOpen &&
        mobileSidebarRef.current &&
        !mobileSidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-primary">
      <Sidebar className="shadow-lg lg:shadow-none max-lg:hidden" />
      <div
        ref={mobileSidebarRef}
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out shadow-lg bg-white dark:bg-primary ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <Header onToggleSidebar={handleToggleSidebar} />

      <div className="flex-1 flex flex-col bg-light_primary lg:bg-white dark:bg-secondary dark:lg:bg-primary">
        <main className="flex-1 flex-col overflow-auto py-2 pr-2 pl-0.5 lg:min-w-0 lg:pt-2 lg:pr-2 lg:pl-64">
          <div className="h-full w-full p-6 grow lg:p-10 overflow-auto lg:rounded-lg lg:ring-1 lg:shadow-xs bg-light_primary dark:bg-secondary dark:lg:bg-zinc-900 lg:ring-white/10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
