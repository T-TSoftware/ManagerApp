import { BuildingOfficeIcon, CircleStackIcon, BanknotesIcon, CreditCardIcon, Square2StackIcon, UsersIcon, ReceiptPercentIcon } from "@heroicons/react/20/solid";
import { PagesMenuItemType } from "../../types/menu/PagesMenu";

export const PageMenuItems = (projectId?: string): PagesMenuItemType[] => {
  
  const basePath = projectId ? `/project/${projectId}` : "";
  
  return [
    {
      label: "Dashboard",
      href: projectId ? `${basePath}/dashboard` : "adminDashboard",
      icon: Square2StackIcon,
      adminYN: !projectId,
    },
    {
      label: "Satışlar",
      href: `${basePath}/sales`,
      icon: BuildingOfficeIcon,
      adminYN: false,
    },
    {
      label: "Stok Durumu",
      href: "/stock",
      icon: CircleStackIcon,
      adminYN: true,
    },
    {
      label: "Tedarik",
      href: `${basePath}/supply`,
      icon: UsersIcon,
      adminYN: false,
    },
    {
      label: "Taşeron",
      href: `${basePath}/subcontractor`,
      icon: ReceiptPercentIcon,
      adminYN: false,
    },
    {
      label: "Cari",
      href: "/current",
      icon: BanknotesIcon,
      adminYN: true,
    },
    {
      label: "Nakit Akış",
      href: "/cashFlow",
      icon: CreditCardIcon,
      adminYN: true,
    },
    {
      label: "Hesap Bakiyeleri",
      href: "/balances",
      icon: CreditCardIcon,
      adminYN: true,
    },
    {
      label: "Admin Dashboard",
      href: "/adminDashboard",
      icon: CreditCardIcon,
      adminYN: false,
    },
  ];
};
