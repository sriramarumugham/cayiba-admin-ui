// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "./pages/login";
import { useAuth } from "./store/auth";
import { ProtectedRoute, PublicRoute } from "./pages/protected-route";
import { AppLayout } from "./layout/app-layout";
import { Toaster } from "@/components/ui/sonner";
import AppRoutes from "./router";

const App: React.FC = () => {
  const { initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes with Shared Layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AppRoutes />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
