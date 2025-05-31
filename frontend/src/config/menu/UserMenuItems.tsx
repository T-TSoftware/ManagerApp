import {
  Cog8ToothIcon,
  ArrowRightEndOnRectangleIcon,
  HomeModernIcon,
} from "@heroicons/react/20/solid";
import { UserMenuItemType } from "../../types/menu/UserMenu";
import ThemeToggle from "../../components/layout/ThemeToggle";
import { useAuth } from "../../context/AuthContext";

export const userMenuItems = (): UserMenuItemType[] => {
  const { logout } = useAuth();

  return [
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
        logout();
      },
    },
  ];
};