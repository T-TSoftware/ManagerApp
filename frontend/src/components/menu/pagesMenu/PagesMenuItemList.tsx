import { NavLink, useLocation } from "react-router-dom";
import { PagesMenuItemType } from "../../../types/menu/PagesMenu";

type Props = {
  item: PagesMenuItemType;
  isExpanded: boolean;
};

const PagesMenuItemList = ({ item, isExpanded }: Props) => {
  const location = useLocation();
  const isActive = location.pathname === item.href;
  
  return (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        `group relative flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 hover:bg-gray-50/50 dark:hover:bg-white/5 ${
          !isExpanded ? "justify-center" : ""
        } ${
          isActive 
            ? "bg-gray-50/70 text-black dark:bg-white/10 dark:text-white" 
            : "text-gray-700 dark:text-gray-400"
        }`
      }
      title={item.label}
    >
      <item.icon
        className={`h-5 w-5 shrink-0 ${
          isActive 
            ? "text-black dark:text-white" 
            : "text-gray-400 group-hover:text-black dark:text-gray-400 dark:group-hover:text-white"
        }`}
        aria-hidden="true"
      />
      {isExpanded && (
        <span className="truncate">{item.label}</span>
      )}
    </NavLink>
  );
};

export default PagesMenuItemList;
