import { useParams } from "react-router-dom";
import { useProjects } from "../../../hooks/useProjects";
import MenuItemsList from "./projectMenuItemsList";
import { ProjectMenuItemType } from "../../../types/menu/ProjectMenu";
import { Project } from "../../../types/project/Project";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

type ProjectMenuProps = {
  items: ProjectMenuItemType[];
};

const ProjectMenu = ({ items }: ProjectMenuProps) => {
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
    <Menu as="div" className="relative text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-between rounded-md  px-2 py-2 gap-0 text-sm font-semibold shadow-xs text-black hover:bg-light_primary dark:text-white dark:hover:bg-secondary">
          <div className="flex gap-3">
            <span className="flex">Artı Concept</span>
            <span className="flex mt-3 font-handwriting italic">
              {selectedProject?.name ?? ""}
            </span>
          </div>

          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 size-5 text-black dark:text-white"
          />
        </MenuButton>
      </div>
      <MenuItems
        transition
        className="absolute z-10 mt-2 min-w-64 origin-top-right shadow-lg rounded-lg text-black bg-white dark:text-white  dark:bg-tertiary"
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
