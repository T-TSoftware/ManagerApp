import {
  Cog8ToothIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/20/solid";
import { UserMenuItemType } from "../../types/menu/UserMenu";
import ThemeToggle from "../../components/layout/ThemeToggle";

export const userMenuItems: UserMenuItemType[] = [
  {
    element: <ThemeToggle />,
  },
  {
    label: "Ayarlar",
    href: "#",
    icon: Cog8ToothIcon,
    separatorBefore: true,
  },
  {
    label: "Çıkış",
    icon: ArrowRightEndOnRectangleIcon,
    onClick: () => {
      localStorage.removeItem("token");
      window.location.href = "/login";



    },
  },
];
