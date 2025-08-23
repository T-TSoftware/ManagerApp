import { PagesMenuItemType } from "../../types/menu/PagesMenu";

export type PortalContext = {
  projectId?: string;
  isAdmin: boolean;
  isEmployee: boolean;
};

/**
 * Menü item görünürlük kontrolü
 * - showInAllPortals: true olan item her zaman görünür
 * - Rol kontrolü: adminYN / employeeYN
 * - Proje portalı: sadece proje path'li item'lar gösterilir, global istisnalar hariç
 */
export function shouldShowMenuItem(
  item: PagesMenuItemType,
  ctx: PortalContext
): boolean {
  // 1) Her yerde görünmesi istenen global item
  if (item.showInAllPortals) return true;

  // 2) Rol bazlı görünürlük
  const roleOK =
    (ctx.isAdmin && item.adminYN) || (ctx.isEmployee && item.employeeYN);

  if (!roleOK) return false;

  // 3) Proje bağlamında proje dışı sayfaları filtrele
  if (ctx.projectId) {
    const basePath = `/project/${ctx.projectId}`;
    const isUnderProject = item.href.startsWith(basePath);
    if (!isUnderProject) return false;
  }

  return true;
}
