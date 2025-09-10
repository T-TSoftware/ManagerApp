// UserMenuItemsList.tsx
import { MenuItem } from "@headlessui/react";
import { UserMenuItemType } from "../../../types/menu/UserMenu";
import { Link } from "react-router-dom"; // ✅ SPA navigation
import { useAuth } from "../../../hooks/useAuth"; // ✅ Context

type Props = {
  items: UserMenuItemType[];
};

const UserMenuItemsList = ({ items }: Props) => {
  const { logout, loading } = useAuth();

  const handleLogout = async () => {
    if (loading) return;
    await logout();
  };

  return (
    <>
      {items.map((item) => (
        <div key={item.id || item.label}>
          {item.separatorBefore && (
            <div
              className="col-span-full mx-3.5 my-1 h-px border-0 bg-zinc-950/5 sm:mx-3 dark:bg-white/10 forced-colors:bg-[CanvasText]"
              role="separator"
            />
          )}

          <div className="py-1 px-3">
            {item.element ? (
              item.element
            ) : item.id === "logout" ? (
              <MenuItem>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`grid w-full grid-cols-[auto_1fr] items-center gap-x-2 px-4 py-2 text-left text-sm rounded-md outline-none hover:bg-light_primary dark:text-white dark:hover:bg-secondary`}
                    disabled={loading}
                    aria-label="Çıkış"
                  >
                    {item.icon && <item.icon className="size-4" />}
                    <p>{loading ? "Çıkış yapılıyor..." : item.label}</p>
                  </button>
                )}
              </MenuItem>
            ) : (
              <MenuItem>
                {({ active }) => (
                  <Link
                    to={item.href || "#"}
                    className={`grid grid-cols-[auto_1fr] items-center gap-x-2 px-4 py-2 text-sm rounded-md outline-none hover:bg-light_primary dark:text-white dark:hover:bg-secondary`}
                    aria-label={item.label}
                  >
                    {item.icon && <item.icon className="size-4" />}
                    <p>{item.label}</p>
                  </Link>
                )}
              </MenuItem>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default UserMenuItemsList;
