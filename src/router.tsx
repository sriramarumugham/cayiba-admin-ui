import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/dashboard";
import SubAdminListPage from "./pages/sub-admin-list";
import CreateSubAdminPage from "./pages/create-admin";
import AdvertisementListPage from "./pages/advertisment-list";
import type { SidebarItem } from "./components/custom/sidebar";

import { Home, Users, ScrollText } from "lucide-react"; // Only icons from lucide-react
import { AdvertismentDetailsPage } from "./pages/advertisment-details";

export const ROUTES = {
  DASHBOARD: "/dashboard",
  USERS: "/users",
  ADMIN: "/admin",
  CREATE_ADMIN: "/admin/create",
  CREATE_USER: "/users/create",
  ROOT: "/",
  ADVERTISMENT: "/advertisement",
  ADVERTISMENT_DETATAILS: "/advertisement/details",
} as const;

export const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: ROUTES.DASHBOARD,
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    badge: 12,
    children: [
      {
        id: "admin",
        label: "All Admin",
        href: ROUTES.ADMIN,
      },
      {
        id: "create-admin",
        label: "Create Admin",
        href: ROUTES.CREATE_ADMIN,
      },
    ],
  },
  {
    id: "advertisment",
    label: "Advertisement",
    icon: ScrollText,
    href: ROUTES.ADVERTISMENT,
  },
];

// Type for route values
export type RouteType = (typeof ROUTES)[keyof typeof ROUTES];

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
      <Route path={ROUTES.ADMIN} element={<SubAdminListPage />} />
      <Route path={ROUTES.CREATE_ADMIN} element={<CreateSubAdminPage />} />
      <Route path={ROUTES.ADVERTISMENT} element={<AdvertisementListPage />} />
      <Route
        path={`${ROUTES.ADVERTISMENT_DETATAILS}/:id`}
        element={<AdvertismentDetailsPage />}
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
