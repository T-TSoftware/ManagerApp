import {
  BuildingOfficeIcon,
  CircleStackIcon,
  BanknotesIcon,
  CreditCardIcon,
  ArrowUturnLeftIcon,
  DocumentCheckIcon,
  Square2StackIcon,
  BuildingLibraryIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  UsersIcon,
  ScaleIcon,
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
      href: projectId ? `${basePath}/stock` : "stock",
      icon: CircleStackIcon,
      adminYN: false,
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
      href: `/current`,
      icon: BanknotesIcon,
      adminYN: true,
    },
    {
      label: "Ödeme Ekle",
      href: "/company-finance",
      icon: CreditCardIcon,
      adminYN: true,
    },
    {
      label: "Çek Ekle",
      href: "/check-finance",
      icon: DocumentCheckIcon,
      adminYN: true,
    },
    {
      label: "Nakit Akış",
      href: "/cash-flow",
      icon: BanknotesIcon,
      adminYN: true,
    },
    {
      label: "Hesap Bakiyeleri",
      href: "/balances",
      icon: BuildingLibraryIcon,
      adminYN: true,
    },
    {
      label: "Banka Hareketleri",
      href: "/bank-movement",
      icon: BuildingLibraryIcon,
      adminYN: true,
    },
    {
      label: "Projeler",
      href: "/projects",
      icon: BuildingOffice2Icon,
      adminYN: true,
    },
    {
      label: "Taşeron Listesi",
      href: "/subcontractor-list",
      icon: UserGroupIcon,
      adminYN: true,
    },
    {
      label: "Tedarikçi Listesi",
      href: "/supplier-list",
      icon: UserGroupIcon,
      adminYN: true,
    },
    {
      label: "Metraj",
      href: `${basePath}/quantity`,
      icon: ScaleIcon,
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
