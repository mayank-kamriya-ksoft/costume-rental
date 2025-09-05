import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { format } from "date-fns";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  IndianRupee,
  Eye,
  Home,
  User,
  Settings,
  Heart,
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import type { Booking, BookingItem } from "@shared/schema";

type BookingWithItems = Booking & { items: BookingItem[] };
type UserTab = "overview" | "bookings" | "profile" | "favorites" | "support";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<UserTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<BookingWithItems[]>({
    queryKey: ["/api/user/bookings"],
    enabled: isAuthenticated,
  });

  // Filter bookings by status
  const activeBookings = bookings.filter(b => b.status === 'active');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const allBookings = bookings;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const sidebarItems = [
    { id: "overview" as UserTab, label: "Overview", icon: Home },
    { id: "bookings" as UserTab, label: "My Bookings", icon: Package },
    { id: "profile" as UserTab, label: "Profile", icon: User },
    { id: "favorites" as UserTab, label: "Favorites", icon: Heart },
    { id: "support" as UserTab, label: "Help & Support", icon: HelpCircle },
  ];

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  if (isLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div>
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-muted-foreground">
                Manage your costume rentals and view your order history
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeBookings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently rented items
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{allBookings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    All time bookings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedBookings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Successfully returned
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {allBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start browsing our amazing costume collection!
                    </p>
                    <Button onClick={() => window.location.href = "/"} data-testid="button-browse-costumes">
                      Browse Costumes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allBookings.slice(0, 3).map((booking) => (
                      <BookingCard 
                        key={booking.id} 
                        booking={booking} 
                        onViewDetails={() => setLocation(`/order/${booking.id}`)}
                      />
                    ))}
                    {allBookings.length > 3 && (
                      <div className="text-center pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab("bookings")}
                          data-testid="button-view-all-orders"
                        >
                          View All Orders ({allBookings.length})
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
        
      case "bookings":
        return (
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-8">My Bookings</h1>
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all" data-testid="tab-all-orders">All Orders ({allBookings.length})</TabsTrigger>
                    <TabsTrigger value="active" data-testid="tab-active-orders">Active ({activeBookings.length})</TabsTrigger>
                    <TabsTrigger value="completed" data-testid="tab-completed-orders">Completed ({completedBookings.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    {allBookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start browsing our amazing costume collection!
                        </p>
                        <Button onClick={() => window.location.href = "/"} data-testid="button-browse-costumes">
                          Browse Costumes
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {allBookings.map((booking) => (
                          <BookingCard 
                            key={booking.id} 
                            booking={booking} 
                            onViewDetails={() => setLocation(`/order/${booking.id}`)}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="active" className="space-y-4">
                    {activeBookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No active rentals</h3>
                        <p className="text-muted-foreground">All your items have been returned.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activeBookings.map((booking) => (
                          <BookingCard 
                            key={booking.id} 
                            booking={booking} 
                            onViewDetails={() => setLocation(`/order/${booking.id}`)}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4">
                    {completedBookings.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No completed orders</h3>
                        <p className="text-muted-foreground">Your completed rentals will appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {completedBookings.map((booking) => (
                          <BookingCard 
                            key={booking.id} 
                            booking={booking} 
                            onViewDetails={() => setLocation(`/order/${booking.id}`)}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        );
        
      case "profile":
        return (
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-8">Profile Settings</h1>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">First Name</label>
                      <p className="text-muted-foreground">{user?.firstName || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Last Name</label>
                      <p className="text-muted-foreground">{user?.lastName || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <p className="text-muted-foreground">{user?.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Phone</label>
                      <p className="text-muted-foreground">{user?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <Button disabled className="mt-4">Edit Profile (Coming Soon)</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case "favorites":
        return (
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-8">My Favorites</h1>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Save costumes you love to easily find them later!
                  </p>
                  <Button onClick={() => window.location.href = "/"}>Browse Costumes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "support":
        return (
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-8">Help & Support</h1>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Customer Service</h4>
                      <p className="text-muted-foreground">Email: support@kamdhenudramaking.com</p>
                      <p className="text-muted-foreground">Phone: +91 98765 43210</p>
                      <p className="text-muted-foreground">Hours: Mon-Sat, 9 AM - 7 PM</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Rental Policies</h4>
                      <p className="text-muted-foreground">• Items must be returned in the same condition</p>
                      <p className="text-muted-foreground">• Late returns may incur additional charges</p>
                      <p className="text-muted-foreground">• Security deposit is refundable upon return</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <div className={cn(
          "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0",
          sidebarOpen ? "w-64" : "w-16"
        )}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              {sidebarOpen && (
                <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                data-testid="button-toggle-sidebar"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      !sidebarOpen && "justify-center px-2"
                    )}
                    onClick={() => setActiveTab(item.id)}
                    data-testid={`sidebar-${item.id}`}
                  >
                    <Icon className="h-4 w-4" />
                    {sidebarOpen && <span className="ml-2">{item.label}</span>}
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderTabContent()}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function BookingCard({ booking, onViewDetails }: { booking: BookingWithItems; onViewDetails: () => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border" data-testid={`booking-card-${booking.id}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Booking Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(booking.status)}
                <Badge className={getStatusColor(booking.status)} data-testid={`status-${booking.status}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
              <Badge className={getPaymentStatusColor(booking.paymentStatus)} data-testid={`payment-${booking.paymentStatus}`}>
                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(booking.startDate), 'MMM dd, yyyy')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                </span>
              </div>
              
              <div className="space-y-1">
                <h4 className="font-semibold">Items ({booking.items.length}):</h4>
                <div className="space-y-1">
                  {booking.items.map((item, index) => (
                    <div key={index} className="text-sm text-muted-foreground" data-testid={`item-${index}`}>
                      • {item.itemName} {item.size && `(${item.size})`}
                    </div>
                  ))}
                </div>
              </div>

              {booking.notes && (
                <p className="text-sm text-muted-foreground italic">
                  "{booking.notes}"
                </p>
              )}
            </div>
          </div>

          {/* Amount Info & Actions */}
          <div className="text-right space-y-2">
            <div className="flex items-center gap-1 text-lg font-semibold">
              <IndianRupee className="h-4 w-4" />
              <span data-testid="total-amount">{booking.totalAmount}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Security: ₹{booking.securityDeposit}
            </div>
            <div className="text-xs text-muted-foreground">
              Booking #{booking.id.slice(-8)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              data-testid={`button-view-details-${booking.id}`}
              className="mt-2"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

