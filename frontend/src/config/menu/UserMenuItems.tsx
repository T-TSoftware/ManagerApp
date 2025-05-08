import {
  Cog8ToothIcon,
  ArrowRightEndOnRectangleIcon,
  HomeModernIcon,
} from "@heroicons/react/20/solid";
import { UserMenuItemType } from "../../types/menu/UserMenu";
import ThemeToggle from "../../components/layout/ThemeToggle";

export const userMenuItems: UserMenuItemType[] = [
  {
    label: "Ayarlar",
    href: "#",
    icon: Cog8ToothIcon,
  },
  {
    label: "Proje Yarat",
    href: "/create-project",
    icon: HomeModernIcon,
  },
  {
    element: <ThemeToggle />,
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