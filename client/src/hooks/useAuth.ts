import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import type { User } from "@shared/schema";

interface AuthResponse {
  user: User;
}

export function useAuth() {
  const [location, setLocation] = useLocation();
  const { data, isLoading, error } = useQuery<AuthResponse>({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Redirect to login if accessing protected routes while unauthenticated
  useEffect(() => {
    const protectedRoutes = ['/dashboard', '/profile'];
    const isOnProtectedRoute = protectedRoutes.some(route => location.startsWith(route));
    
    if (!isLoading && !data?.user && isOnProtectedRoute) {
      setLocation('/login');
    }
  }, [data?.user, isLoading, location, setLocation]);

  return {
    user: data?.user,
    isLoading,
    isAuthenticated: !!data?.user,
    error,
  };
}