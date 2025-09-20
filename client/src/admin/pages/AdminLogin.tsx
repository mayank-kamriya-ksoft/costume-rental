import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/admin/auth/login", { email, password });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Welcome back! Taking you to your dashboard...",
      });
      
      // Invalidate admin auth query to trigger re-authentication check
      queryClient.invalidateQueries({ queryKey: ["/api/admin/auth/user"] });
      
      // Redirect to admin dashboard
      setTimeout(() => {
        setLocation("/admin");
      }, 100);
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid admin credentials",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <CardHeader className="space-y-6 pb-8">
            <div className="flex justify-center">
              <div className="p-3 bg-blue-600 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                Sign in to manage the costume rental system
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  data-testid="input-admin-email"
                  disabled={loginMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10"
                    data-testid="input-admin-password"
                    disabled={loginMutation.isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loginMutation.isPending}
                data-testid="button-admin-login"
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            {loginMutation.error && (
              <Alert variant="destructive">
                <AlertDescription data-testid="text-login-error">
                  {loginMutation.error.message || "Login failed. Please check your credentials."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Secure admin access only. Contact system administrator if you need access.
          </p>
        </div>
      </div>
    </div>
  );
}