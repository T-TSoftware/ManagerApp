import { useParams } from "react-router-dom";
import { useProjects } from "../../../hooks/useProjects";
import MenuItemsList from "./projectMenuItemsList";
import { ProjectMenuItemType } from "../../../types/menu/ProjectMenu";
import { Project } from "../../../types/project/Project";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { CircleChevronDown } from "lucide-react";


type ProjectMenuProps = {
  items: ProjectMenuItemType[];
  inHeader?: boolean;
};

const ProjectMenu = ({ items, inHeader = false }: ProjectMenuProps) => {
  const { projects } = useProjects();
  const { projectId } = useParams();
  const selectedProject = projects.find((p) => p.id === projectId);

  const dynamicItems: ProjectMenuItemType[] = projects.map(
    (project: Project) => ({
      label: project.name,
      href: `/project/${project.id}/dashboard`,
      target: "_blank",
    })
  );

  return (
    <Menu as="div" className="relative h-full">
      <MenuButton 
        className={`h-full flex items-center gap-2 px-2 text-sm font-semibold text-black hover:bg-gray-50/50 dark:text-white dark:hover:bg-white/5 rounded-md ${
          inHeader ? "py-1.5" : "w-full py-2"
        }`}
      >
        <span className="flex items-center gap-2">
          <span>Artı Concept</span>
          {selectedProject?.name && (
            <span className="text-xs font-handwriting italic">
              {selectedProject.name}
            </span>
          )}
        </span>
        <CircleChevronDown
          className="h-4 w-4 text-black dark:text-white"
          aria-hidden="true"
        />
      </MenuButton>

      <MenuItems
        className={`absolute z-10 mt-1 w-64 rounded-lg bg-white shadow-lg dark:bg-tertiary dark:text-white ring-1 ring-black/5 dark:ring-white/10 focus:outline-none ${
          inHeader ? "left-0" : "right-0"
        }`}
      >
        <MenuItemsList items={items} />
        <div className="max-h-[50vh] overflow-y-auto">
          <MenuItemsList items={dynamicItems} />
        </div>
      </MenuItems>
    </Menu>
  );
};

export default ProjectMenu;
