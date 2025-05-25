import {
  BuildingOfficeIcon,
  CircleStackIcon,
  BanknotesIcon,
  CreditCardIcon,
  ArrowUturnLeftIcon,
  Square2StackIcon,
  UsersIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/20/solid";
import { PagesMenuItemType } from "../../types/menu/PagesMenu";

export const PageMenuItems = (projectId?: string): PagesMenuItemType[] => {
  const basePath = projectId ? `/project/${projectId}` : "";

  return [
    {
      label: "Genel Bakış",
      href: projectId ? `${basePath}/dashboard` : "admin-dashboard",
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
      href: `${basePath}/current`,
      icon: BanknotesIcon,
      adminYN: false,
    },
    {
      label: "Nakit Akış",
      href: "/cash-flow",
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
      label: "Projeler",
      href: "/projects",
      icon: CreditCardIcon,
      adminYN: true,
    },
    {
      label: "Taşeron Listesi",
      href: "/subcontractor-list",
      icon: CreditCardIcon,
      adminYN: true,
    },
    {
      label: "Tedarikçi Listesi",
      href: "/supplier-list",
      icon: CreditCardIcon,
      adminYN: true,
    },
    {
      label: "Metraj",
      href: `${basePath}/quantity`,
      icon: CreditCardIcon,
      adminYN: false,
    },
    {
      label: "Maliyet Özeti",
      href: `${basePath}/cost-summary`,
      icon: CreditCardIcon,
      adminYN: false,
    },
    {
      label: "Admin Genel Bakış",
      href: "/admin-dashboard",
      icon: ArrowUturnLeftIcon,
      adminYN: false,
    },
  ];
};
