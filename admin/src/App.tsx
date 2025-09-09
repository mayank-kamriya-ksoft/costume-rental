import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import AdminLogin from "./pages/login";
import AdminDashboard from "./pages/dashboard";

function AdminRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/admin/login" component={AdminLogin} />
      ) : (
        <>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/:tab" component={AdminDashboard} />
        </>
      )}
      {/* Redirect to login if not authenticated */}
      <Route>
        {() => {
          if (!isAuthenticated) {
            window.location.href = "/admin/login";
            return null;
          }
          return <AdminDashboard />;
        }}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AdminRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;