import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import DashboardStats from "@/components/admin/dashboard-stats";
import InventoryManagement from "@/components/admin/inventory-management";
import BookingManagement from "@/components/admin/booking-management";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart3, 
  Package, 
  Calendar, 
  Users, 
  Settings,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

type AdminTab = "dashboard" | "inventory" | "bookings" | "customers" | "reports" | "settings";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems = [
    { id: "dashboard" as AdminTab, label: "Dashboard", icon: BarChart3 },
    { id: "inventory" as AdminTab, label: "Inventory", icon: Package },
    { id: "bookings" as AdminTab, label: "Bookings", icon: Calendar },
    { id: "customers" as AdminTab, label: "Customers", icon: Users },
    { id: "reports" as AdminTab, label: "Reports", icon: BarChart3 },
    { id: "settings" as AdminTab, label: "Settings", icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardStats />;
      case "inventory":
        return <InventoryManagement />;
      case "bookings":
        return <BookingManagement />;
      case "customers":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Customer Management</h1>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">Customer management feature coming soon...</p>
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
                <p className="text-muted-foreground text-center">Advanced reporting features coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">System settings coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin />
      
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={cn(
          "bg-card border-r border-border w-64 flex-shrink-0 transition-transform duration-300",
          !sidebarOpen && "md:hidden"
        )}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-primary mr-2" />
                <span className="font-bold text-foreground">Admin Panel</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
                data-testid="button-sidebar-toggle"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <nav className="mt-6">
            <div className="px-6 py-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start mb-2",
                      activeTab === item.id && "bg-primary/10 text-primary"
                    )}
                    onClick={() => setActiveTab(item.id)}
                    data-testid={`tab-${item.id}`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
