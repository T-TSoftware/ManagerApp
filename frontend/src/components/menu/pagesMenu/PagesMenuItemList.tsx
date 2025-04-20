import { NavLink, useLocation } from "react-router-dom";
import { PagesMenuItemType } from "../../../types/menu/PagesMenu";

type Props = {
  item: PagesMenuItemType;
};

const PagesMenuItemList = ({ item }: Props) => {
  const location = useLocation();
  const isActive = location.pathname === item.href;
  
  return (
    <>
      {isActive && (
        <span className="absolute inset-y-2 -left-4 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r transition-all duration-300 ease-in-out bg-black dark:bg-white" />
      )}

      <NavLink
        to={item.href}
        className={({ isActive }) =>
          `flex items-center gap-3 py-2 px-2 rounded-lg transition-colors duration-150 text-black hover:bg-light_primary dark:text-white dark:hover:bg-white/10  ${
            isActive ? "font-medium" : "text-black/60 dark:text-white/60"
          }`
        }
      >
        <item.icon
          className={`size-5 transition-colors ${
            isActive ? "text-black dark:text-white" : "text-black/60 dark:text-white/60"
          }`}
        />
        <span className="text-sm">{item.label}</span>
      </NavLink>
    </>
  );
};

export default PagesMenuItemList;
