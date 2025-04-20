import { ElementType } from "react";

export type ProjectMenuItemType = {
  label: string;
  href: string;
  icon?: ElementType;
  separatorLater?: boolean;
  target?: "_blank" | "_self";
};
