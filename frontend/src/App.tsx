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
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Balances from "./pages/Balances";
import Quantity from "./pages/Quantity";
import CostSummary from "./pages/CostSummary";
import Projects from "./pages/Projects";
import SubcontractorList from "./pages/SubcontractorList";
import SupplierList from "./pages/SupplierList";

import { AlertProvider } from "./context/AlertContext"; 
import Alert from "./components/feedback/Alert"; 

function App() {
  return (
    <AlertProvider>
      
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="stock" element={<Stock />} />
            <Route path="current" element={<Current />} />
            <Route path="cash-flow" element={<CashFlow />} />
            <Route path="balances" element={<Balances />} />
            <Route path="projects" element={<Projects />} />
            <Route path="subcontractor-list" element={<SubcontractorList />} />
            <Route path="supplier-list" element={<SupplierList />} />
          </Route>

          <Route
            path="/project/:projectId"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="supply" element={<Supply />} />
            <Route path="sales" element={<Sales />} />
            <Route path="current" element={<Current />} />
            <Route path="subcontractor" element={<Subcontractor />} />
            <Route path="quantity" element={<Quantity />} />
            <Route path="cost-summary" element={<CostSummary />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AlertProvider>
  );
}

export default App;
