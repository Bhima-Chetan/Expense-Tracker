import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import AnalyticsDashboard from './pages/analytics-dashboard';
import DashboardOverview from './pages/dashboard-overview';
import TransactionHistory from './pages/transaction-history';
import AddTransaction from './pages/add-transaction';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
        <Route path="/dashboard-overview" element={<DashboardOverview />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
        <Route path="/add-transaction" element={<AddTransaction />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
