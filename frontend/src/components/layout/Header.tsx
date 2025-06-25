import { Bars3Icon, HomeIcon } from "@heroicons/react/24/outline";
import UserMenu from "../menu/userMenu/UserMenu";
import ProjectMenu from "../menu/projectMenu/projectMenu";
import { projectMenuItems } from "../../config/menu/ProjectMenuItems";
import { userMenuItems } from "../../config/menu/UserMenuItems";

type HeaderProps = {
  onToggleSidebar: () => void;
  isSidebarExpanded: boolean;
};

const Header = ({ onToggleSidebar, isSidebarExpanded }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-12 items-center bg-white dark:bg-primary">
      <div
        className={`flex items-center gap-4 px-4 lg:pl-6 ${
          isSidebarExpanded ? "lg:pl-6" : "lg:pl-5"
        }`}
      >
        <button
          type="button"
          className="hidden lg:flex items-center justify-center text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
          onClick={onToggleSidebar}
        >
          <HomeIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="lg:hidden -m-2.5 p-2.5 text-gray-700 dark:text-gray-200"
          onClick={onToggleSidebar}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="h-8">
          <ProjectMenu items={projectMenuItems} inHeader />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end px-4 sm:px-6 lg:px-8">
        <UserMenu items={userMenuItems} />
      </div>
    </header>
  );
};

export default Header;
