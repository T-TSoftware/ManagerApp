import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../src/layouts/MainLayout";
import Dashboard from "./pages/Dashboard/index";
import Stock from "./pages/Stock/index";
import Current from "./pages/Current/index";
import Supply from "./pages/Supply/index";
import Sales from "./pages/Sales/index";
import Subcontractor from "./pages/Subcontractor/index";
import AdminDashboard from "./pages/AdminDashboard/index";
import LoginPage from "./pages/Login";
import CashFlow from "./pages/CashFlow";
import Balances from "./pages/Balances";
import Quantity from "./pages/Quantity";
import CostSummary from "./pages/CostSummary";
import Projects from "./pages/Projects";
import SubcontractorList from "./pages/SubcontractorList";
import SupplierList from "./pages/SupplierList";
import { Toaster } from "react-hot-toast";

import { AlertProvider } from "./context/AlertContext"; 
import Alert from "./components/feedback/Alert";
import CompanyFinance from "./pages/CompanyFinance";
import CheckFinance from "./pages/CheckFinance";
import BankMovement from "./pages/BankMovement";

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
            <Route path="current" element={<Current />} />
            <Route path="cash-flow" element={<CashFlow />} />
            <Route path="company-finance" element={<CompanyFinance />} />
            <Route path="check-finance" element={<CheckFinance />} />
            <Route path="bank-movement" element={<BankMovement />} />
            <Route path="balances" element={<Balances />} />
            <Route path="projects" element={<Projects />} />
            <Route path="subcontractor-list" element={<SubcontractorList />} />
            <Route path="supplier-list" element={<SupplierList />} />
          </Route>

          <Route path="/project/:projectId" element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="supply" element={<Supply />} />
            <Route path="sales" element={<Sales />} />
            <Route path="current" element={<Current />} />
            <Route path="subcontractor" element={<Subcontractor />} />
            <Route path="quantity" element={<Quantity />} />
            <Route path="stock" element={<Stock />} />
            <Route path="cost-summary" element={<CostSummary />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AlertProvider>
  );
}

export default App;
