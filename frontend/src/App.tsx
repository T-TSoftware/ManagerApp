import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AlertProvider } from "./context/AlertContext";
import Alert from "./components/feedback/Alert";

import MainLayout from "../src/layouts/MainLayout";

import AdminBalances from "./pages/AdminBalances/index";
import AdminBankMovement from "./pages/AdminBankMovement";
import AdminCashFlow from "./pages/AdminCashFlow/index";
import AdminCheckFinance from "./pages/AdminCheckFinance";
import AdminCompanyFinance from "./pages/AdminCompanyFinance";
import AdminLoan from "./pages/AdminLoan";
import AdminCurrent from "./pages/AdminCurrent/index";
import AdminDashboard from "./pages/AdminDashboard/index";
import AdminSales from "./pages/AdminSales";
import AdminStock from "./pages/AdminStock";
import AdminSubcontractor from "./pages/AdminSubcontractor/index";
import AdminSupplier from "./pages/AdminSupplier/index";
import Barter from "./pages/Barter/index";
import Employees from "./pages/Employees";
import EmployeesAnnualLeave from "./pages/EmployeesAnnualLeave";
import LoginPage from "./pages/Login/index";
import ProjectCostSummary from "./pages/ProjectCostSummary/index";
import ProjectDashboard from "./pages/ProjectDashboard/index";
import ProjectQuantity from "./pages/ProjectQuantity/index";
import Projects from "./pages/Projects/index";
import ProjectSales from "./pages/ProjectSales/index";
import ProjectStock from "./pages/ProjectStock/index";
import ProjectSubcontractor from "./pages/ProjectSubcontractor/index";
import ProjectSupply from "./pages/ProjectSupply/index";
import UserSettings from "./pages/UserSetting/index"


function App() {
  return (
    <AlertProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            success: {
              duration: 3000,
              style: {
                background: "#10B981",
                color: "white",
              },
            },
            error: {
              duration: 5000,
              style: {
                background: "#EF4444",
                color: "white",
              },
            },
            loading: {
              style: {
                background: "#3B82F6",
                color: "white",
              },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MainLayout />}>
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="current" element={<AdminCurrent />} />
            <Route path="stock" element={<AdminStock />} />
            <Route path="loans" element={<AdminLoan />} />
            <Route path="cash-flow" element={<AdminCashFlow />} />
            <Route path="company-finance" element={<AdminCompanyFinance />} />
            <Route path="check-finance" element={<AdminCheckFinance />} />
            <Route path="bank-movement" element={<AdminBankMovement />} />
            <Route path="sales" element={<AdminSales />} />
            <Route path="balances" element={<AdminBalances />} />
            <Route path="projects" element={<Projects />} />
            <Route path="subcontractor-list" element={<AdminSubcontractor />} />
            <Route path="supplier-list" element={<AdminSupplier />} />
            <Route path="user-settings" element={<UserSettings />} />
            <Route path="barter" element={<Barter />} />
          </Route>

          <Route path="/project/:projectId" element={<MainLayout />}>
            <Route path="dashboard" element={<ProjectDashboard />} />
            <Route path="supply" element={<ProjectSupply />} />
            <Route path="sales" element={<ProjectSales />} />
            <Route path="current" element={<AdminCurrent />} />
            <Route path="subcontractor" element={<ProjectSubcontractor />} />
            <Route path="quantity" element={<ProjectQuantity />} />
            <Route path="stock" element={<ProjectStock />} />
            <Route path="cost-summary" element={<ProjectCostSummary />} />
          </Route>

          <Route path="/employees-portal/" element={<MainLayout />}>
            <Route path="employees" element={<Employees />} />
            <Route path="annual-leave" element={<EmployeesAnnualLeave />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AlertProvider>
  );
}

export default App;
