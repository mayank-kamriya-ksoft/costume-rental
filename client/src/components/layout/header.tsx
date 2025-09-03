import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Crown,
  Phone,
  MapPin
} from "lucide-react";

interface HeaderProps {
  isAdmin?: boolean;
}

export default function Header({ isAdmin = false }: HeaderProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-orange-400 via-purple-500 to-yellow-400 border-b border-border shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" data-testid="link-home">
            <Crown className="h-8 w-8 text-white mr-2 drop-shadow-lg" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white drop-shadow-lg">Kamdhenu Drama King</span>
              <span className="text-xs text-white/90 hidden sm:block">Premium Costume Rentals</span>
            </div>
          </Link>
          
          {/* Contact Info & Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-white/90 text-sm">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>9822044498</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Chh. Sambhaji Nagar</span>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/" className={`font-medium transition-colors ${
                location === "/" ? "text-white font-bold" : "text-white/80 hover:text-white"
              }`} data-testid="nav-browse">
                Browse Costumes
              </Link>
              <Link href="/admin" className={`font-medium transition-colors ${
                location === "/admin" ? "text-white font-bold" : "text-white/80 hover:text-white"
              }`} data-testid="nav-admin">
                Admin Dashboard
              </Link>
            </nav>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {!isAdmin && (
              <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/20" data-testid="button-cart">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-white text-orange-600">
                  0
                </Badge>
              </Button>
            )}
            <Button className="bg-white text-orange-600 hover:bg-white/90 font-semibold" data-testid="button-signin">
              Sign In
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/20 bg-black/10">
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col space-y-2 text-white/90 text-sm border-b border-white/20 pb-3">
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
                  className="text-white hover:text-white/80 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-nav-browse"
                >
                  Browse Costumes
                </Link>
                <Link 
                  href="/admin" 
                  className="text-white hover:text-white/80 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-nav-admin"
                >
                  Admin Dashboard
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
