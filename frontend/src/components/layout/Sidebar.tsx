import { XMarkIcon } from "@heroicons/react/24/outline";
import ProjectMenu from "../menu/projectMenu/projectMenu";
import PagesMenu from "../menu/pagesMenu/PagesMenu";
import UserMenu from "../menu/userMenu/UserMenu";
import { projectMenuItems } from "../../config/menu/ProjectMenuItems";
import { userMenuItems } from "../../config/menu/UserMenuItems";

type SidebarProps = {
  className?: string;
  onClose?: () => void;
};

const Sidebar = ({ className = "", onClose }: SidebarProps) => {
  return (
    <aside className={`w-64 h-full fixed ${className}`}>
      <div className="flex justify-end lg:hidden">
        <button onClick={onClose}>
          <XMarkIcon className="h-6 w-6 pt-2 pr-2 text-black dark:text-white" />
        </button>
      </div>
      <nav className="flex h-full min-h-0 flex-col">
        <div className="flex flex-col p-4 border-b border-gray-100 dark:border-white/5">
          <ProjectMenu items={projectMenuItems} />
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          <PagesMenu />
        </div>
        <div className="max-lg:hidden flex flex-col border-t p-4 border-gray-100 dark:border-white/5">
          <UserMenu items={userMenuItems} />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
