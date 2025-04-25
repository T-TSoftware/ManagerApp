import { Cog8ToothIcon } from "@heroicons/react/20/solid";
import { UserMenuItemType } from "../../types/menu/UserMenu";
import ThemeToggle from "../../components/layout/ThemeToggle";

export const userMenuItems: UserMenuItemType[] = [
  {
    label: "Ayarlar",
    href: "#",
    icon: Cog8ToothIcon,
  },
  {
    element: <ThemeToggle />,
  },
];
