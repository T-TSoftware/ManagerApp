import { MenuItem } from "@headlessui/react";
import { ProjectMenuItemType } from "../../../types/menu/ProjectMenu";

type Props = {
  items: ProjectMenuItemType[];
};

const ProjectMenuItemsList = ({ items }: Props) => {
  return (
    <>
      {items.map((item) => (
        <div key={item.label}>
          <div className="py-1 px-3">
            <MenuItem>
              <a
                href={item.href}
                target={item.target}
                rel={
                  item.target === "_blank" ? "noopener noreferrer" : undefined
                }
                className="grid grid-cols-[auto_1fr] gap-x-2 items-center px-4 py-2 text-sm rounded-md text-black hover:bg-light_primary dark:text-white dark:hover:bg-secondary"
              >
                {item.icon && (
                  <item.icon className="size-4 text-black dark:text-white" />
                )}
                <p>{item.label}</p>
              </a>
            </MenuItem>
          </div>
          {item.separatorLater && (
            <div
              className="col-span-full mx-3.5 my-1 h-px border-0 bg-zinc-950/5 sm:mx-3 dark:bg-white/10 dark:forced-colors:bg-[CanvasText]"
              role="separator"
            />
          )}
        </div>
      ))}
    </>
  );
};

export default ProjectMenuItemsList;
