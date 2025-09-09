import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { useAdminAuth } from "./hooks/useAdminAuth";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddItemPage from "./components/AddItemPage";

export default function AdminRouter() {
  const { isAuthenticated, isLoading, error } = useAdminAuth();
  const [location, setLocation] = useLocation();

  // Redirect to login if not authenticated and not already on login page
  useEffect(() => {
    if (!isLoading && !isAuthenticated && location !== "/admin/login") {
      console.log("Admin not authenticated, redirecting to login");
      setLocation("/admin/login");
    }
  }, [isAuthenticated, isLoading, location, setLocation]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Always render login page if not authenticated
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route component={AdminLogin} />
      </Switch>
    );
  }

  // Render dashboard if authenticated
  return (
    <Switch>
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/add-item" component={AddItemPage} />
      <Route path="/admin/login" component={() => {
        // If already authenticated and trying to access login, redirect to dashboard
        setLocation("/admin");
        return null;
      }} />
    </Switch>
  );
}