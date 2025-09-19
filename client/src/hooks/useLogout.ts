import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface UseLogoutOptions {
  isAdmin?: boolean;
}

export function useLogout({ isAdmin = false }: UseLogoutOptions = {}) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest('POST', isAdmin ? '/api/admin/auth/logout' : '/api/auth/logout'),
    onSuccess: () => {
      // Clear all React Query cache to prevent stale data
      queryClient.clear();
      
      // Show success toast
      toast({
        title: "✅ Logged out successfully",
        description: "You have been securely logged out from your account.",
        variant: "success",
      });
      
      // Redirect to appropriate login page after successful logout
      setTimeout(() => {
        // Use replace to prevent back button from showing protected content
        const loginPath = isAdmin ? '/admin/login' : '/login';
        window.history.replaceState(null, '', loginPath);
        setLocation(loginPath);
      }, 500);
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "An unexpected error occurred during logout.";
      toast({
        title: "❌ Logout Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
  
  return {
    logout: () => logoutMutation.mutate(),
    isPending: logoutMutation.isPending,
  };
}