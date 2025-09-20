import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { 
  BarChart3, 
  Package, 
  Calendar, 
  Users, 
  Settings,
  Menu,
  LogOut,
  IndianRupee,
  TrendingUp,
  Bell,
  Search,
  Shield,
  Activity,
  ArrowLeft,
  Sparkles,
  Tags,
  Image,
  Save,
  CreditCard
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../hooks/use-toast";
import { useLogout } from "../../hooks/useLogout";
import InventoryManagement from "../components/InventoryManagement";
import CategoryManagement from "../components/CategoryManagement";
import CustomerManagement from "../components/CustomerManagement";
import PointOfSale from "../components/PointOfSale";
import EnhancedBookingManagement from "../../components/admin/enhanced-booking-management";

type AdminStats = {
  totalRevenue?: number;
  activeRentals?: number;
  availableItems?: number;
  overdueReturns?: number;
};

type AdminTab = "dashboard" | "inventory" | "add-item" | "categories" | "bookings" | "customers" | "pos" | "reports" | "settings";

type Category = {
  id: string;
  name: string;
  description: string;
  type: string;
};

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Parse URL to determine active tab
  const getActiveTabFromUrl = (url: string): AdminTab => {
    if (url.includes('/add-item')) return 'add-item';
    if (url.includes('/inventory')) return 'inventory';
    if (url.includes('/categories')) return 'categories';
    if (url.includes('/bookings')) return 'bookings';
    if (url.includes('/customers')) return 'customers';
    if (url.includes('/pos')) return 'pos';
    if (url.includes('/reports')) return 'reports';
    if (url.includes('/settings')) return 'settings';
    return 'dashboard';
  };
  
  const [activeTab, setActiveTab] = useState<AdminTab>(getActiveTabFromUrl(location));
  
  // Update activeTab when URL changes
  React.useEffect(() => {
    const newTab = getActiveTabFromUrl(location);
    setActiveTab(newTab);
  }, [location]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Update URL when tab changes
  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    const newPath = tab === 'dashboard' ? '/admin' : `/admin/${tab}`;
    setLocation(newPath);
  };
  
  // Form data for add item
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    pricePerDay: "",
    securityDeposit: "",
    sizes: "",
    status: "available",
    imageUrl: "",
    themes: "",
    linkedCharacters: "",
  });

  // Fetch admin dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  // Fetch recent bookings for dashboard
  const { data: recentBookings = [] } = useQuery({
    queryKey: ["/api/bookings", { limit: 3 }],
    select: (data: any[]) => data.slice(0, 3), // Get only top 3 most recent
  });
  
  // Categories for add item form
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Determine item type based on selected category
  const selectedCategory = categories?.find(cat => cat.id === formData.categoryId);
  const itemType = selectedCategory?.type || "";

  const createItemMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = itemType === "costume" ? "/api/costumes" : "/api/accessories";
      const response = await apiRequest("POST", endpoint, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ 
        title: "Success", 
        description: `${itemType === "costume" ? "Costume" : "Accessory"} added successfully!` 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/costumes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/accessories"] });
      handleTabChange("inventory");
      // Reset form
      setFormData({
        name: "",
        description: "",
        categoryId: "",
        pricePerDay: "",
        securityDeposit: "",
        sizes: "",
        status: "available",
        imageUrl: "",
        themes: "",
        linkedCharacters: "",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const sidebarItems = [
    { id: "dashboard" as AdminTab, label: "Dashboard", icon: BarChart3 },
    { id: "inventory" as AdminTab, label: "Inventory", icon: Package },
    { id: "add-item" as AdminTab, label: "Add Item", icon: Package },
    { id: "categories" as AdminTab, label: "Categories", icon: Tags },
    { id: "bookings" as AdminTab, label: "Bookings", icon: Calendar },
    { id: "customers" as AdminTab, label: "Customers", icon: Users },
    { id: "pos" as AdminTab, label: "Point of Sale", icon: CreditCard },
    { id: "reports" as AdminTab, label: "Reports", icon: BarChart3 },
    { id: "settings" as AdminTab, label: "Settings", icon: Settings },
  ];

  const { logout, isPending: isLoggingOut } = useLogout({ isAdmin: true });

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
            <Button variant="ghost" onClick={logout} className="text-slate-600 dark:text-slate-400 hover:text-red-600" data-testid="button-admin-logout" disabled={isLoggingOut}>
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? "Logging out..." : "Logout"}
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
                <IndianRupee className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-2" data-testid="text-total-revenue">
                {statsLoading ? (
                  <div className="animate-pulse bg-emerald-200 dark:bg-emerald-700 h-8 w-20 rounded"></div>
                ) : (
                  `₹${stats?.totalRevenue || 0}`
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
                ) : recentBookings.length > 0 ? (
                  recentBookings.map((booking: any) => {
                    const getStatusColors = (status: string) => {
                      switch (status) {
                        case "active":
                          return { bg: "bg-blue-500", badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-300" };
                        case "completed":
                          return { bg: "bg-green-500", badge: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300" };
                        case "pending":
                          return { bg: "bg-amber-500", badge: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-300" };
                        case "cancelled":
                          return { bg: "bg-red-500", badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-300" };
                        default:
                          return { bg: "bg-gray-500", badge: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-300" };
                      }
                    };
                    const colors = getStatusColors(booking.status);
                    return (
                      <div key={booking.id} className={`flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border-l-4 border-l-${colors.bg.split('-')[1]}-500`}>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {booking.items?.[0]?.itemName || "Multiple Items"}
                            {booking.items?.length > 1 && ` +${booking.items.length - 1}`}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {booking.customerName} - #{booking.id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <Badge className={colors.badge} data-testid={`status-booking-${booking.status}`}>
                          {booking.status}
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm">No recent bookings</p>
                  </div>
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

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    const data = {
      ...formData,
      pricePerDay: parseFloat(formData.pricePerDay),
      securityDeposit: parseFloat(formData.securityDeposit),
      sizes: formData.sizes.split(",").map(s => s.trim()).filter(s => s),
      ...(itemType === "costume" && {
        themes: formData.themes.split(",").map(t => t.trim()).filter(t => t)
      }),
      ...(itemType === "accessory" && {
        linkedCharacters: formData.linkedCharacters.split(",").map(c => c.trim()).filter(c => c)
      }),
    };
    
    createItemMutation.mutate(data);
  };

  const renderAddItemForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("inventory")}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            data-testid="button-back-to-inventory"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Add New Item
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                {selectedCategory 
                  ? `Creating a new ${itemType} in ${selectedCategory.name}` 
                  : "Add a new costume or accessory to your inventory"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-700">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Item Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleAddItemSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Basic Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Item Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter item name"
                      className="h-12 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 text-base"
                      required
                      data-testid="input-item-name"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="category" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Category *
                    </Label>
                    <Select 
                      value={formData.categoryId} 
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                      disabled={categoriesLoading}
                    >
                      <SelectTrigger className="h-12 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-base" data-testid="select-item-category">
                        <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select category"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center space-x-2">
                              {category.type === "costume" ? (
                                <Package className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Sparkles className="h-4 w-4 text-green-500" />
                              )}
                              <span>{category.name}</span>
                              <span className="text-xs text-slate-500 ml-2">({category.type})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter detailed description of the item"
                    className="min-h-[120px] border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 resize-none text-base"
                    data-testid="textarea-item-description"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                {/* Pricing Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <IndianRupee className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Pricing & Availability</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="pricePerDay" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Price per Day (₹) *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">₹</span>
                        <Input
                          id="pricePerDay"
                          type="number"
                          step="0.01"
                          value={formData.pricePerDay}
                          onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                          placeholder="0.00"
                          className="pl-12 h-12 border-slate-200 dark:border-slate-700 focus:border-green-500 focus:ring-green-500/20 text-base"
                          required
                          data-testid="input-item-price"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="securityDeposit" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Security Deposit (₹) *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">₹</span>
                        <Input
                          id="securityDeposit"
                          type="number"
                          step="0.01"
                          value={formData.securityDeposit}
                          onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                          placeholder="0.00"
                          className="pl-12 h-12 border-slate-200 dark:border-slate-700 focus:border-green-500 focus:ring-green-500/20 text-base"
                          required
                          data-testid="input-item-deposit"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="sizes" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Available Sizes
                      </Label>
                      <Input
                        id="sizes"
                        value={formData.sizes}
                        onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                        placeholder="S, M, L, XL"
                        className="h-12 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 text-base"
                        data-testid="input-item-sizes"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Status *
                      </Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger className="h-12 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-base" data-testid="select-item-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span>Available</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="rented">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span>Rented</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="cleaning">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <span>Cleaning</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="damaged">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span>Damaged</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                {/* Media & Details Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Image className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Additional Details</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="imageUrl" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Image URL
                    </Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="h-12 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20 text-base"
                      data-testid="input-item-image"
                    />
                  </div>

                  {itemType === "costume" && (
                    <div className="space-y-3">
                      <Label htmlFor="themes" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        <div className="flex items-center space-x-2">
                          <Tags className="h-4 w-4" />
                          <span>Themes</span>
                        </div>
                      </Label>
                      <Input
                        id="themes"
                        value={formData.themes}
                        onChange={(e) => setFormData({ ...formData, themes: e.target.value })}
                        placeholder="Traditional, Modern, Festival"
                        className="h-12 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20 text-base"
                        data-testid="input-costume-themes"
                      />
                    </div>
                  )}

                  {itemType === "accessory" && (
                    <div className="space-y-3">
                      <Label htmlFor="linkedCharacters" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="h-4 w-4" />
                          <span>Linked Characters</span>
                        </div>
                      </Label>
                      <Input
                        id="linkedCharacters"
                        value={formData.linkedCharacters}
                        onChange={(e) => setFormData({ ...formData, linkedCharacters: e.target.value })}
                        placeholder="Krishna, Ganesha, Durga"
                        className="h-12 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20 text-base"
                        data-testid="input-accessory-characters"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleTabChange("inventory")}
                    disabled={createItemMutation.isPending}
                    className="px-8 h-12 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-base"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createItemMutation.isPending || !formData.categoryId} 
                    className="px-8 h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-base font-medium"
                    data-testid="button-save-item"
                  >
                    {createItemMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="h-5 w-5" />
                        <span>Create {itemType ? itemType.charAt(0).toUpperCase() + itemType.slice(1) : "Item"}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </form>
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
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
            <InventoryManagement />
          </div>
        );
      case "add-item":
        return renderAddItemForm();
      case "categories":
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
            <CategoryManagement />
          </div>
        );
      case "customers":
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
            <CustomerManagement />
          </div>
        );
      case "bookings":
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
            <EnhancedBookingManagement />
          </div>
        );
      case "pos":
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">Point of Sale</h1>
              <PointOfSale />
            </div>
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
                onClick={() => handleTabChange(item.id)}
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
        
        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-4 h-12 rounded-xl text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
            onClick={logout}
            disabled={isLoggingOut}
            data-testid="button-admin-logout"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="font-medium">{isLoggingOut ? "Logging out..." : "Logout"}</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderTabContent()}
      </div>
    </div>
  );
}