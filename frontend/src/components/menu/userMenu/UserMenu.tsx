import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import UserMenuItemsList from "./UserMenuItemList";
import { UserMenuItemType } from "../../../types/menu/UserMenu";
import Avatar from "../../../assets/Images/avatar.png";

type UserMenuProps = {
  items: UserMenuItemType[];
};

const UserMenu = ({ items }: UserMenuProps) => {
  return (
    <Menu as="div" className="relative text-left">
      <MenuButton className="cursor-default flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium sm:py-2 sm:text-sm/5 text-black hover:bg-light_primary dark:text-zinc-950 dark:hover:bg-secondary">
        <span className="flex min-w-0 items-center gap-3">
          <span className="relative size-10 inline-grid shrink-0 align-middle  *:col-start-1 *:row-start-1">
            <img
              className="absolute size-full rounded-full"
              src={Avatar}
              alt="user"
            ></img>
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
              Şükrü
            </span>
            <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
              sükrü@articoncept.com
            </span>
          </span>
        </span>
        <span className="flex min-w-0 items-center gap-3">
          <ChevronUpIcon
            aria-hidden="true"
            className="-mr-1 size-5 text-black dark:text-white cursor-pointer"
          />
        </span>
      </MenuButton>

      <MenuItems
        transition
        className="absolute bottom-full mb-2 w-64 origin-bottom-right rounded-lg shadow-lg transition  bg-white dark:bg-tertiary focus:outline-none z-50"
      >
        <UserMenuItemsList items={items} />
      </MenuItems>
    </Menu>
  );
};

export default UserMenu;
