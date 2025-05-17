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
              className="col-span-full mx-3.5 my-1 h-px border-0 sm:mx-3 bg-zinc-950/5 dark:bg-white/10 dark:forced-colors:bg-[CanvasText]"
              role="separator"
            />
          )}

          <div className="py-1 px-3">
            {item.element ? (
              <>{item.element}</>
            ) : (
              <MenuItem>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className={`grid w-full text-left grid-cols-[auto_1fr] gap-x-2 items-center px-4 py-2 text-sm rounded-md ${
                      active
                        ? "bg-light_primary dark:bg-secondary"
                        : "text-black dark:text-white"
                    }`}
                  >
                    {item.icon && (
                      <item.icon className="size-4 dark:text-white" />
                    )}
                    <p className="dark:text-white">{item.label}</p>
                  </button>
                )}
              </MenuItem>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default UserMenuItemsList;
