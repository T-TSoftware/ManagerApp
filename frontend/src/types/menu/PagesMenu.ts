export type PagesMenuItemType = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  portalYN: boolean;
  adminYN: boolean;
  employeeYN: boolean;
  visibleIn?: Array<"admin" | "project" | "employee">; 
};
