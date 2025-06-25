export type UserMenuItemType = {
  id:string;
  label?: string;
  href?: string;
  icon?: React.ElementType;
  separatorBefore?: boolean;
  element?: React.ReactNode;
  onClick?: () => void;
};
