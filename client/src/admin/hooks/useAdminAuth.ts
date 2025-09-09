import { useQuery } from "@tanstack/react-query";

export function useAdminAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/admin/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}