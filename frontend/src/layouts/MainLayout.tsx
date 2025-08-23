import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const MainLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const mobileSidebarRef = useRef<HTMLDivElement>(null);

  const handleToggleSidebar = () => {
    const isDesktop = window.innerWidth >= 1024; // lg breakpoint
    if (isDesktop) {
      setIsSidebarExpanded((s) => !s);
    } else {
      setIsMobileSidebarOpen((s) => !s);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileSidebarOpen &&
        mobileSidebarRef.current &&
        !mobileSidebarRef.current.contains(event.target as Node)
      ) {
        setIsMobileSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileSidebarOpen]);

  return (
    <div className="h-dvh flex flex-col bg-white dark:bg-primary">
      <Header
        onToggleSidebar={handleToggleSidebar}
        isSidebarExpanded={isSidebarExpanded}
      />

      {/* İçteki satırda akışı kilitle, sadece content scroll yapsın */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Desktop Sidebar (absolute, parent relative) */}
        <Sidebar
          className="z-20 shadow-lg lg:shadow-none max-lg:hidden absolute top-0 bottom-0 left-0"
          isExpanded={isSidebarExpanded}
        />

        {/* Mobile Sidebar */}
        <div
          ref={mobileSidebarRef}
          className={`lg:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            onClose={() => setIsMobileSidebarOpen(false)}
            isExpanded={true}
          />
        </div>

        {/* Main Content (sidebar genişliğine göre margin) */}
        <main
          className={`flex-1 p-2 transition-all duration-300 ${
            isSidebarExpanded ? "lg:ml-64" : "lg:ml-16"
          } h-full overflow-hidden`}
        >
          {/* SADECE burası scroll yapsın */}
          <div className="h-full w-full overflow-y-auto rounded-lg bg-light_primary dark:bg-secondary">
            <Outlet />
          </div>
        </main>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-40"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MainLayout;
