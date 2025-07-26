import React from "react";
import Banner from "../../assets/images/userPageBanner.gif";
import Avatar from "../../assets/images/avatar.png";

const UserSettingsPage: React.FC = () => {
  return (
    <div className="grow p-3 lg:rounded-lg lg:shadow-xs h-full border-gray-100">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end justify-between gap-4">
          <p className="text-3xl font-semibold sm:text-3xl text-black dark:text-white">
            Kullanıcı Profili
          </p>
        </div>

        <div className="mt-8 overflow-x-auto whitespace-nowrap">
          <div className="flex flex-col min-w-full p-6 rounded-md shadow-xl bg-white dark:bg-tertiary">
            {/* Avatar + Actions */}
            <div className="relative">
              <img
                src={Banner}
                alt="cover"
                className="h-36 w-full rounded-md object-cover"
              />
              <div className="absolute -bottom-8 left-4 flex items-center gap-3">
                <img
                  src={Avatar}
                  alt="avatar"
                  className="h-16 w-16 rounded-full border-4 border-white dark:border-tertiary object-cover"
                />
                <div>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    Taylan Güloğlu
                  </p>
                  <span className="inline-block rounded-md bg-red-300 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    Süper Admin
                  </span>
                </div>
              </div>
            </div>

            {/* Upload/Delete buttons */}
            <div className="mt-10 flex gap-2 justify-end">
              <button className="rounded-full border px-4 py-2 text-sm bg-light_fourth text-white dark:border-fourth hover:shadow-md">
                Kullanıcı Oluştur
              </button>
            </div>

            {/* Form Fields */}
            <div className="mt-6 space-y-4 text-sm text-black dark:text-white">
              <div className="flex gap-4">
                <div className="w-full">
                  <label className="mb-1 block text-black dark:text-white">
                    Ad
                  </label>
                  <input
                    className="w-full border rounded-lg p-2 text-black dark:text-white"
                    defaultValue="Robbie"
                  />
                </div>
                <div className="w-full">
                  <label className="mb-1 block text-black dark:text-white">
                    Soyad
                  </label>
                  <input
                    className="w-full border rounded-lg p-2 text-black dark:text-white"
                    defaultValue="Ordell"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-black dark:text-white">
                  E-mail / Kullanıcı Adı
                </label>
                <input
                  className="w-full border rounded-lg p-2 text-black dark:text-white"
                  placeholder="Kullanıcı Adı"
                />
              </div>

              <div>
                <label className="mb-1 block text-black dark:text-white">
                  Şifre
                </label>
                <input
                  type="password"
                  className="w-full border rounded-lg p-2 text-black dark:text-white"
                  defaultValue="********"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button className="rounded-full border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-sm text-zinc-600 dark:text-white hover: dark:hover:bg-zinc-800">
                Cancel
              </button>
              <button className="rounded-full px-4 py-2 text-sm bg-light_fourth text-white dark:border-fourth hover:shadow-md">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
