import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';

// Layouts
import SplashLayout from './layouts/SplashLayout';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import SplashView from './pages/SplashView';
import LandingView from './pages/LandingView';
import LoginView from './pages/auth/LoginView';
import RegisterView from './pages/auth/RegisterView';
import HomeView from './pages/dashboard/HomeView';
import WalletView from './pages/dashboard/WalletView';
import DepositView from './pages/dashboard/DepositView';
import WithdrawView from './pages/dashboard/WithdrawView';
import ProfitView from './pages/dashboard/ProfitView';
import ReferralView from './pages/dashboard/ReferralView';
import HistoryView from './pages/dashboard/HistoryView';
import ProfileView from './pages/dashboard/ProfileView';

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminDeposits from './pages/admin/AdminDeposits';
import AdminWithdraws from './pages/admin/AdminWithdraws';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuthStore();
  return isAuthenticated && user?.is_admin === 1 ? <>{children}</> : <Navigate to="/admin/login" />;
};

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<SplashView />} />
        <Route path="/landing" element={<LandingView />} />

        {/* Auth */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginView />} />
          <Route path="register" element={<RegisterView />} />
        </Route>

        {/* Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<HomeView />} />
          <Route path="wallet" element={<WalletView />} />
          <Route path="deposit" element={<DepositView />} />
          <Route path="withdraw" element={<WithdrawView />} />
          <Route path="profit" element={<ProfitView />} />
          <Route path="referral" element={<ReferralView />} />
          <Route path="history" element={<HistoryView />} />
          <Route path="profile" element={<ProfileView />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><MainLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="deposits" element={<AdminDeposits />} />
          <Route path="withdraws" element={<AdminWithdraws />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
