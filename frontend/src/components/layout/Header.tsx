import {
  Bars2Icon,
} from "@heroicons/react/24/outline";
import HeaderUserMenu from "../menu/userMenu/HeaderUserMenu";
import { userMenuItems } from "../../config/menu/UserMenuItems";

type HeaderProps = {
  onToggleSidebar: () => void;
};

const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <header className="lg:hidden p-4 flex items-center justify-between shadow-md bg-light_primary dark:bg-secondary">
      <div className="py-2.5">
        <span className="relative">
          <button
            onClick={onToggleSidebar}
            className="text-black dark:text-gray-700 text-2xl font-bold "
            aria-label="Open Sidebar"
          >
            <Bars2Icon className="size-5 text-black dark:text-white" />
          </button>
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <nav className="flex flex-1 items-center gap-4 py-2.5">
          <div className="-ml-4 flex-1"></div>
          <div className="flex items-center gap-3">
            <HeaderUserMenu items={userMenuItems} />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
