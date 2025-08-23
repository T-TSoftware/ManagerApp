import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { PageMenuItems } from "../../../config/menu/PageMenuItems";
import PageMenuItemList from "./PagesMenuItemList";

type PagesMenuProps = {
  isExpanded?: boolean;
};

type PortalMode = "admin" | "project" | "employee";

const detectPortal = (pathname: string, projectId?: string): PortalMode => {
  if (pathname.startsWith("/employees-portal")) return "employee";
  if (projectId) return "project";
  return "admin";
};

const PagesMenu = ({ isExpanded = false }: PagesMenuProps) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { pathname } = useLocation();

  const portal = detectPortal(pathname, projectId);
  const items = useMemo(() => PageMenuItems(projectId), [projectId]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // New explicit visibility rule (preferred):
      if (Array.isArray(item.visibleIn)) {
        return item.visibleIn.includes(portal);
      }

      // Backward compatibility (if visibleIn is not provided):
      if (portal === "employee") return item.employeeYN === true;
      if (portal === "project") return !item.adminYN && !item.employeeYN;
      // admin portal:
      return item.adminYN === true && item.employeeYN !== true;
    });
  }, [items, portal]);

  return (
    <nav className="py-3">
      <div className="space-y-1 px-3">
        {filteredItems.map((item) => (
          <PageMenuItemList
            key={item.href}
            item={item}
            isExpanded={isExpanded}
          />
        ))}
      </div>
    </nav>
  );
};

export default PagesMenu;
