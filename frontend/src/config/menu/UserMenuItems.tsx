
import { UserMenuItemType } from "../../types/menu/UserMenu";
import ThemeToggle from "../../components/layout/ThemeToggle";
import { Settings , LogOut } from "lucide-react";

export const userMenuItems: UserMenuItemType[] = [
  {
    id: "themeToggle",
    element: <ThemeToggle />,
  },
  {
    id: "settings",
    label: "Ayarlar",
    href: "/user-settings",
    icon: Settings,
    separatorBefore: true,
  },
  {
    id: "logout",
    label: "Çıkış",
    icon: LogOut,
    onClick: () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    },
  },
];
