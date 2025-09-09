import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  BarChart3, 
  Package, 
  Calendar, 
  Users, 
  Settings,
  Menu,
  LogOut,
  DollarSign,
  TrendingUp
} from "lucide-react";
import { cn } from "../lib/utils";

type AdminTab = "dashboard" | "inventory" | "bookings" | "customers" | "reports" | "settings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch admin dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
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

  const handleLogout = () => {
    window.location.href = "/api/admin/auth/logout";
  };

  const renderDashboardContent = () => (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout} data-testid="button-admin-logout">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-revenue">
              {statsLoading ? "Loading..." : `$${stats?.totalRevenue || 0}`}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-bookings">
              {statsLoading ? "Loading..." : stats?.activeBookings || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-inventory-count">
              {statsLoading ? "Loading..." : stats?.totalItems || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-customer-count">
              {statsLoading ? "Loading..." : stats?.totalCustomers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest costume rental bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statsLoading ? (
                <p className="text-muted-foreground text-center py-8">Loading recent bookings...</p>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Krishna Costume</p>
                      <p className="text-sm text-muted-foreground">John Doe - #B001</p>
                    </div>
                    <Badge variant="default" data-testid="status-booking-confirmed">Confirmed</Badge>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Lakshmi Costume</p>
                      <p className="text-sm text-muted-foreground">Jane Smith - #B002</p>
                    </div>
                    <Badge variant="secondary" data-testid="status-booking-pending">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Hanuman Costume</p>
                      <p className="text-sm text-muted-foreground">Mike Johnson - #B003</p>
                    </div>
                    <Badge variant="default" data-testid="status-booking-confirmed">Confirmed</Badge>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Ganesha Crown</p>
                  <p className="text-sm text-muted-foreground">Accessory</p>
                </div>
                <Badge variant="destructive" data-testid="stock-low">2 left</Badge>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Durga Sword</p>
                  <p className="text-sm text-muted-foreground">Accessory</p>
                </div>
                <Badge variant="destructive" data-testid="stock-low">1 left</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Peacock Feathers</p>
                  <p className="text-sm text-muted-foreground">Accessory</p>
                </div>
                <Badge variant="outline" data-testid="stock-medium">5 left</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardContent();
      case "inventory":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Inventory Management</h1>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">
                  Inventory management features will be implemented here...
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case "bookings":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Booking Management</h1>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">
                  Booking management features will be implemented here...
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case "customers":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Customer Management</h1>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">
                  Customer management features will be implemented here...
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case "reports":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Reports & Analytics</h1>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">
                  Reporting and analytics features will be implemented here...
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">System Settings</h1>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">
                  System settings will be implemented here...
                </p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={cn(
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-testid="button-toggle-sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            {sidebarOpen && (
              <h2 className="font-bold text-lg text-foreground">Admin Panel</h2>
            )}
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  !sidebarOpen && "px-2 justify-center"
                )}
                onClick={() => setActiveTab(item.id)}
                data-testid={`nav-${item.id}`}
              >
                <Icon className="h-4 w-4" />
                {sidebarOpen && <span>{item.label}</span>}
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