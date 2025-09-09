import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { 
  BarChart3, 
  Package, 
  Calendar, 
  Users, 
  Settings,
  Menu,
  LogOut,
  DollarSign,
  TrendingUp,
  Bell,
  Search,
  Shield,
  Activity
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useLocation } from "wouter";
import InventoryManagement from "../components/InventoryManagement";

type AdminStats = {
  totalRevenue?: number;
  activeRentals?: number;
  availableItems?: number;
  overdueReturns?: number;
};

type AdminTab = "dashboard" | "inventory" | "bookings" | "customers" | "reports" | "settings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [, setLocation] = useLocation();

  // Fetch admin dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  const sidebarItems = [
    { id: "dashboard" as AdminTab, label: "Dashboard", icon: BarChart3 },
    { id: "inventory" as AdminTab, label: "Inventory", icon: Package },
    { id: "bookings" as AdminTab, label: "Bookings", icon: Calendar },
    { id: "customers" as AdminTab, label: "Customers", icon: Users },
    { id: "reports" as AdminTab, label: "Reports", icon: BarChart3 },
    { id: "settings" as AdminTab, label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { 
        method: "POST", 
        credentials: "include" 
      });
      setLocation("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      setLocation("/admin/login");
    }
  };

  const renderDashboardContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Modern Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Costume Rental Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
            </Button>
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium">
                AD
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" onClick={handleLogout} className="text-slate-600 dark:text-slate-400 hover:text-red-600" data-testid="button-admin-logout">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Total Revenue</CardTitle>
              <div className="p-2 bg-emerald-500 rounded-lg shadow-md">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-2" data-testid="text-total-revenue">
                {statsLoading ? (
                  <div className="animate-pulse bg-emerald-200 dark:bg-emerald-700 h-8 w-20 rounded"></div>
                ) : (
                  `$${stats?.totalRevenue || 0}`
                )}
              </div>
              <div className="flex items-center text-xs">
                <TrendingUp className="h-3 w-3 text-emerald-600 mr-1" />
                <span className="text-emerald-600 font-medium">+20.1% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">Active Bookings</CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg shadow-md">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2" data-testid="text-active-bookings">
                {statsLoading ? (
                  <div className="animate-pulse bg-blue-200 dark:bg-blue-700 h-8 w-16 rounded"></div>
                ) : (
                  stats?.activeRentals || 0
                )}
              </div>
              <div className="flex items-center text-xs">
                <TrendingUp className="h-3 w-3 text-blue-600 mr-1" />
                <span className="text-blue-600 font-medium">+180.1% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300">Inventory Items</CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg shadow-md">
                <Package className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2" data-testid="text-inventory-count">
                {statsLoading ? (
                  <div className="animate-pulse bg-purple-200 dark:bg-purple-700 h-8 w-16 rounded"></div>
                ) : (
                  stats?.availableItems || 0
                )}
              </div>
              <div className="flex items-center text-xs">
                <TrendingUp className="h-3 w-3 text-purple-600 mr-1" />
                <span className="text-purple-600 font-medium">+19% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-amber-700 dark:text-amber-300">Overdue Returns</CardTitle>
              <div className="p-2 bg-amber-500 rounded-lg shadow-md">
                <Activity className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-2" data-testid="text-overdue-count">
                {statsLoading ? (
                  <div className="animate-pulse bg-amber-200 dark:bg-amber-700 h-8 w-16 rounded"></div>
                ) : (
                  stats?.overdueReturns || 0
                )}
              </div>
              <div className="flex items-center text-xs">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1 rotate-180" />
                <span className="text-green-600 font-medium">-2% from last week</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Activity Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">Recent Bookings</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">Latest costume rental bookings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {statsLoading ? (
                  <div className="space-y-3">
                    <div className="animate-pulse flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                      </div>
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border-l-4 border-green-500">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">Krishna Costume</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">John Doe - #B001</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300" data-testid="status-booking-confirmed">Confirmed</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border-l-4 border-amber-500">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">Lakshmi Costume</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Jane Smith - #B002</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-300" data-testid="status-booking-pending">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border-l-4 border-green-500">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">Hanuman Costume</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Mike Johnson - #B003</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300" data-testid="status-booking-confirmed">Confirmed</Badge>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">Low Stock Alerts</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">Items requiring attention</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Ganesha Crown</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Accessory</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-300" data-testid="stock-low">2 left</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Durga Sword</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Accessory</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-300" data-testid="stock-low">1 left</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Peacock Feathers</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Accessory</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-300" data-testid="stock-medium">5 left</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardContent();
      case "inventory":
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
            <InventoryManagement />
          </div>
        );
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
              </h1>
              <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Settings className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} features will be implemented here...
                  </p>
                  <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
                    This section is under development
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Enhanced Sidebar */}
      <div className={cn(
        "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-r border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 shadow-xl",
        sidebarOpen ? "w-72" : "w-16"
      )}>
        <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              data-testid="button-toggle-sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <h2 className="font-bold text-lg bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Admin Panel
                </h2>
              </div>
            )}
          </div>
        </div>
        
        <nav className="p-4 space-y-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 h-12 rounded-xl transition-all duration-200 relative group",
                  !sidebarOpen && "px-3 justify-center",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:from-blue-600 hover:to-purple-600"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                )}
                onClick={() => setActiveTab(item.id)}
                data-testid={`nav-${item.id}`}
              >
                {isActive && (
                  <div className="absolute inset-y-0 left-0 w-1 bg-white rounded-r-full"></div>
                )}
                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-600 dark:text-slate-400")} />
                {sidebarOpen && (
                  <span className={cn("font-medium", isActive ? "text-white" : "text-slate-700 dark:text-slate-300")}>
                    {item.label}
                  </span>
                )}
                {!sidebarOpen && (
                  <div className="absolute left-16 bg-slate-900 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderTabContent()}
      </div>
    </div>
  );
}