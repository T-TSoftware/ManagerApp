import { MenuItem } from "@headlessui/react";
import { UserMenuItemType } from "../../../types/menu/UserMenu";

type Props = {
  items: UserMenuItemType[];
};

const UserMenuItemsList = ({ items }: Props) => {
  return (
    <>
      {items.map((item, index) => (
        <div key={item.label ?? index}>
          {item.separatorBefore && (
            <div
              className="col-span-full mx-3.5 my-1 h-px border-0 sm:mx-3 bg-white/10 dark:bg-zinc-950/5 dark:forced-colors:bg-[CanvasText]"
              role="separator"
            />
          )}

          <div className="py-1 px-3">
            {item.element ? (
              <>{item.element}</>
            ) : (
              <MenuItem>
                <a
                  href={item.href}
                  className="grid grid-cols-[auto_1fr] gap-x-2 items-center px-4 py-2 text-sm rounded-md text-black hover:bg-light_primary dark:text-white dark:hover:bg-secondary"
                >
                  {item.icon && (
                    <item.icon className="size-4 dark:text-white" />
                  )}
                  <p>{item.label}</p>
                </a>
              </MenuItem>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default UserMenuItemsList;
