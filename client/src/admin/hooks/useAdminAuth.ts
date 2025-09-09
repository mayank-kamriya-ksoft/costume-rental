import { useQuery } from "@tanstack/react-query";

export function useAdminAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/admin/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user && !error,
  };
}