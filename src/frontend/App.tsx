import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import UserLogin from "../pages/UserLogin";
import AdminLogin from "../pages/AdminLogin";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import UserApp from "../pages/UserApp";
import Sidebar from "../components/Sidebar";

const PrivateRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  if (requireAdmin && user.role !== "ADMIN") {
    return <Navigate to="/app" />;
  }

  // Admin layouts get the sidebar
  if (user.role === "ADMIN") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-8">
          {children}
        </main>
      </div>
    );
  }

  // Users get full screen app view
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<UserLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      
      {/* Admin Protected Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute requireAdmin={true}>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute requireAdmin={true}>
            <Users />
          </PrivateRoute>
        }
      />

      {/* User Protected Routes */}
      <Route
        path="/app"
        element={
          <PrivateRoute>
            <UserApp />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
