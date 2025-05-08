export type UserMenuItemType = {
  label?: string;
  href?: string;
  icon?: React.ElementType;
  separatorBefore?: boolean;
  element?: React.ReactNode;
  onClick?: () => void;
};
