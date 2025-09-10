import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "../route/ProtectedRoute";
import PublicOnlyRoute from "../route/PublicOnlyRoute";

import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/Login";

import AdminBalances from "../pages/AdminBalances";
import AdminBankMovement from "../pages/AdminBankMovement";
import AdminCashFlow from "../pages/AdminCashFlow";
import AdminCheckFinance from "../pages/AdminCheckFinance";
import AdminCompanyFinance from "../pages/AdminCompanyFinance";
import AdminLoan from "../pages/AdminLoan";
import AdminCurrent from "../pages/AdminCurrent";
import AdminDashboard from "../pages/AdminDashboard";
import AdminSales from "../pages/AdminSales";
import AdminStock from "../pages/AdminStock";
import Barter from "../pages/Barter";
import Employees from "../pages/Employees";
import EmployeesAnnualLeave from "../pages/EmployeesAnnualLeave";
import ProjectCostSummary from "../pages/ProjectCostSummary";
import ProjectDashboard from "../pages/ProjectDashboard";
import ProjectQuantity from "../pages/ProjectQuantity";
import Projects from "../pages/Projects";
import ProjectSales from "../pages/ProjectSales";
import ProjectStock from "../pages/ProjectStock";
import ProjectSubcontractor from "../pages/ProjectSubcontractor";
import ProjectSupply from "../pages/ProjectSupply";
import UserSettings from "../pages/UserSetting";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicOnlyRoute />,
    children: [
      { path: "login", element: <LoginPage /> }, // 👈 /login
    ],
  },

  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <AdminDashboard /> }, // "/"
          { path: "admin-dashboard", element: <AdminDashboard /> },
          { path: "current", element: <AdminCurrent /> },
          { path: "stock", element: <AdminStock /> },
          { path: "loans", element: <AdminLoan /> },
          { path: "cash-flow", element: <AdminCashFlow /> },
          { path: "company-finance", element: <AdminCompanyFinance /> },
          { path: "check-finance", element: <AdminCheckFinance /> },
          { path: "bank-movement", element: <AdminBankMovement /> },
          { path: "sales", element: <AdminSales /> },
          { path: "balances", element: <AdminBalances /> },
          { path: "projects", element: <Projects /> },
          { path: "user-settings", element: <UserSettings /> },
          { path: "barter", element: <Barter /> },
        ],
      },

      // Project scoped pages (layout aynı: MainLayout)
      {
        path: "project/:projectId",
        element: <MainLayout />,
        children: [
          { path: "dashboard", element: <ProjectDashboard /> },
          { path: "supply", element: <ProjectSupply /> },
          { path: "sales", element: <ProjectSales /> },
          { path: "current", element: <AdminCurrent /> },
          { path: "subcontractor", element: <ProjectSubcontractor /> },
          { path: "quantity", element: <ProjectQuantity /> },
          { path: "stock", element: <ProjectStock /> },
          { path: "cost-summary", element: <ProjectCostSummary /> },
        ],
      },

      // Employees portal (layout MainLayout)
      {
        path: "employees-portal",
        element: <MainLayout />,
        children: [
          { path: "employees", element: <Employees /> },
          { path: "annual-leave", element: <EmployeesAnnualLeave /> },
        ],
      },
    ],
  },

  // 404 (opsiyonel)
  // { path: "*", element: <NotFound /> },
]);
