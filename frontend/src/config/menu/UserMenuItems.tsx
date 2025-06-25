import {
  Cog8ToothIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/20/solid";
import { UserMenuItemType } from "../../types/menu/UserMenu";
import ThemeToggle from "../../components/layout/ThemeToggle";

export const userMenuItems: UserMenuItemType[] = [
  {
    id: "themeToggle",
    element: <ThemeToggle />,
  },
  {
    id: "settings",
    label: "Ayarlar",
    href: "#",
    icon: Cog8ToothIcon,
    separatorBefore: true,
  },
  {
    id: "logout",
    label: "Çıkış",
    icon: ArrowRightEndOnRectangleIcon,
    onClick: () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    },
  },
];
