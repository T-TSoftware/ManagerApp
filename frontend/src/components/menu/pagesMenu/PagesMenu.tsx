import { useParams } from "react-router-dom";
import { PageMenuItems } from "../../../config/menu/PageMenuItems";
import PageMenuItemList from "./PagesMenuItemList";

const PagesMenu = () => {

  const { projectId } = useParams<{ projectId: string }>();

  const menuItems = PageMenuItems(projectId);
  
  const filteredItems = menuItems.filter((item) =>
    projectId ? !item.adminYN : item.adminYN
  );

  return (
    <aside className=" h-full">
      <nav className="flex flex-col gap-2">
        {filteredItems.map((item) => (
          <span key={item.label} className="relative">
            <PageMenuItemList item={item} />
          </span>
        ))}
      </nav>
    </aside>
  );
};

export default PagesMenu;


