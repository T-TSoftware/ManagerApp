import { ElementType } from "react";

export type UserMenuItemType = {
  label: string;
  href: string;
  icon?: ElementType;
  separatorBefore?: boolean;
};
