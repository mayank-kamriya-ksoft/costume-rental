import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";

export function useAuth() {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/admin/auth/user"],
    retry: false,
  });

  // Redirect to admin login if accessing protected admin routes while unauthenticated
  useEffect(() => {
    const protectedAdminRoutes = ['/admin/dashboard', '/admin/pos', '/admin/inventory', '/admin/bookings'];
    const isOnProtectedRoute = protectedAdminRoutes.some(route => location.startsWith(route));
    
    if (!isLoading && !user && isOnProtectedRoute) {
      setLocation('/admin/login');
    }
  }, [user, isLoading, location, setLocation]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}