import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Public Pages
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailsPage from './pages/ListingDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Pages (Dashboard)
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import MyListings from './pages/MyListings';
import AddListingPage from './pages/AddListingPage';
import EditListingPage from './pages/EditListingPage';
import Favorites from './pages/Favorites';
import ProfileSettings from './pages/ProfileSettings';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminListingApproval from './pages/AdminListingApproval';
import AdminCategoryManagement from './pages/AdminCategoryManagement';
import AdminMediaManagement from './pages/AdminMediaManagement';
import AdminReportCenter from './pages/AdminReportCenter';
import AdminSystemSettings from './pages/AdminSystemSettings';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/:id" element={<ListingDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Routes (Protected) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="my-listings" element={<MyListings />} />
          <Route 
            path="add-listing" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'landlord']}>
                <AddListingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="edit-listing/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'landlord']}>
                <EditListingPage />
              </ProtectedRoute>
            } 
          />
          <Route path="favorites" element={<Favorites />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>

        {/* Admin Routes (Protected) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminAnalytics />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="listings" element={<MyListings adminView />} /> 
          <Route path="approvals" element={<AdminListingApproval />} /> 
          <Route path="categories" element={<AdminCategoryManagement />} />
          <Route path="media" element={<AdminMediaManagement />} />
          <Route path="reports" element={<AdminReportCenter />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route 
            path="settings" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSystemSettings />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
