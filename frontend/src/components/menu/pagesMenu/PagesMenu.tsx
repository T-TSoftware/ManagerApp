import { useParams } from "react-router-dom";
import { PageMenuItems } from "../../../config/menu/PageMenuItems";
import PageMenuItemList from "./PagesMenuItemList";

type PagesMenuProps = {
  isExpanded?: boolean;
};

const PagesMenu = ({ isExpanded = false }: PagesMenuProps) => {
  const { projectId } = useParams<{ projectId: string }>();
  const menuItems = PageMenuItems(projectId);
  
  const filteredItems = menuItems.filter((item) =>
    projectId ? !item.adminYN : item.adminYN
  );

  return (
    <nav className="py-3">
      <div className="space-y-1 px-3">
        {filteredItems.map((item) => (
          <PageMenuItemList key={item.label} item={item} isExpanded={isExpanded} />
        ))}
      </div>
    </nav>
  );
};

export default PagesMenu;


