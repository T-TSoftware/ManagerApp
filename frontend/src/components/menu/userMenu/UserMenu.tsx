import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import UserMenuItemsList from "./UserMenuItemList";
import { UserMenuItemType } from "../../../types/menu/UserMenu";
import Avatar from "../../../assets/Images/avatar.png";

type UserMenuProps = {
  items: UserMenuItemType[];
};

const UserMenu = ({ items }: UserMenuProps) => {
  return (
    <Menu as="div" className="relative text-left">
      <MenuButton
        className="cursor-default relative flex min-w-0 items-center rounded-lg text-left"
        aria-label="Open User Menu"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="absolute top-1/2 left-[calc(-16px+1px)] size-[max(100%,2.25rem)] -translate-x-1/2 -translate-y-1/2">
            <img
              className="size-full rounded-full"
              src={Avatar}
              alt="user"
            ></img>
          </span>
        </span>
      </MenuButton>
      <MenuItems
        transition
        className="absolute right-0 mt-6 min-w-64  rounded-lg  shadow-lg translate-x-[-1px] bg-white ring-grey-100 dark:bg-tertiary dark:ring-white/10 dark:text-white"
      >
        <UserMenuItemsList items={items} />
      </MenuItems>
    </Menu>
  );
};

export default UserMenu;
