import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Crown,
  Phone,
  MapPin,
  User,
  LogOut,
  Settings
} from "lucide-react";

interface HeaderProps {
  isAdmin?: boolean;
}

export default function Header({ isAdmin = false }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/auth/logout'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleLogin = () => {
    setLocation("/login");
  };
  
  const handleRegister = () => {
    setLocation("/register");
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  return (
    <header className="bg-gradient-to-r from-white via-amber-50/50 to-purple-50/50 border-b-2 border-purple-200 shadow-xl sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center group hover:scale-105 transition-all duration-300" data-testid="link-home">
            <div className="relative">
              <Crown className="h-14 w-14 text-purple-600 mr-4 group-hover:text-amber-500 transition-colors duration-300 drop-shadow-lg" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-pulse opacity-80"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-amber-600 bg-clip-text text-transparent tracking-tight">
                Kamdhenu Drama King
              </span>
              <span className="text-sm text-purple-600 font-semibold hidden sm:block">✨ Premium Mythological Costume Rentals ✨</span>
            </div>
          </Link>
          
          {/* Enhanced Contact Info & Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-4 text-sm font-bold">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-amber-100 border border-purple-200 rounded-2xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <Phone className="h-5 w-5 text-purple-600" />
                <span className="text-purple-700">9822044498</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-purple-100 border border-amber-200 rounded-2xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <MapPin className="h-5 w-5 text-amber-600" />
                <span className="text-amber-700">Sambhaji Nagar</span>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/" className={`font-bold transition-all duration-300 px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 ${
                location === "/" ? 
                  "bg-gradient-to-r from-purple-600 to-purple-700 text-white" : 
                  "bg-gradient-to-r from-white to-purple-50 text-purple-700 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200"
              }`} data-testid="nav-browse">
                🌟 Browse Costumes
              </Link>
              {isAuthenticated && (
                <Link href="/dashboard" className={`font-bold transition-all duration-300 px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  location === "/dashboard" ? 
                    "bg-gradient-to-r from-amber-500 to-amber-600 text-white" : 
                    "bg-gradient-to-r from-white to-amber-50 text-amber-700 hover:from-amber-100 hover:to-amber-200 border-2 border-amber-200"
                }`} data-testid="nav-dashboard">
                ✨ My Orders
                </Link>
              )}
            </nav>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {!isAdmin && (
              <Button variant="ghost" size="sm" className="relative text-foreground hover:bg-accent rounded-lg p-3" data-testid="button-cart">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-white font-bold">
                  0
                </Badge>
              </Button>
            )}
            
            {/* Authentication UI */}
            {isLoading ? (
              <div className="h-8 w-20 bg-white/20 rounded animate-pulse" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-white/10 hover:bg-white/20" data-testid="button-user-menu">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-white text-orange-600 text-sm font-semibold">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-sm" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem data-testid="menu-profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    disabled={logoutMutation.isPending}
                    data-testid="menu-logout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {logoutMutation.isPending ? "Logging out..." : "Log out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  className="text-foreground hover:bg-accent font-semibold px-4 py-2 rounded-lg" 
                  onClick={handleLogin}
                  data-testid="button-login"
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-primary text-white hover:bg-primary/90 font-semibold px-6 py-2 rounded-lg shadow-sm" 
                  onClick={handleRegister}
                  data-testid="button-register"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border bg-accent/50">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-3 text-muted-foreground text-sm border-b border-border pb-4">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>9822044498</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Pandariba Road, near Jagrut Hanuman Temple</span>
                </div>
              </div>
              <nav className="flex flex-col space-y-3">
                <Link 
                  href="/" 
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-nav-browse"
                >
                  Browse Costumes
                </Link>
                {isAuthenticated && (
                  <Link 
                    href="/dashboard" 
                    className="text-foreground hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="mobile-nav-dashboard"
                  >
                    My Orders
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
      
    </header>
  );
}
