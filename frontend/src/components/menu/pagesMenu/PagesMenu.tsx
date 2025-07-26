import { useParams } from "react-router-dom";
import { PageMenuItems } from "../../../config/menu/PageMenuItems";
import PageMenuItemList from "./PagesMenuItemList";

type PagesMenuProps = {
  isExpanded?: boolean;
};

const PagesMenu = ({ isExpanded = false }: PagesMenuProps) => {
  const { projectId } = useParams<{ projectId: string }>();
  const pathname = window.location.pathname;

  const isEmployeePortal = pathname.startsWith("/employees-portal");
  const menuItems = PageMenuItems(projectId);

  const roleMode = isEmployeePortal
    ? "employee"
    : projectId
    ? "project"
    : "admin";

  const filteredItems = menuItems.filter((item) => {
    switch (roleMode) {
      case "employee":
        return item.employeeYN;
      case "project":
        return !item.adminYN && !item.employeeYN;
      case "admin":
        return item.adminYN && !item.employeeYN;;
      default:
        return false;
    }
  });

  return (
    <nav className="py-3">
      <div className="space-y-1 px-3">
        {filteredItems.map((item) => (
          <PageMenuItemList
            key={item.label}
            item={item}
            isExpanded={isExpanded}
          />
        ))}
      </div>
    </nav>
  );
};

export default PagesMenu;
