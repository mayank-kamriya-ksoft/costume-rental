import { useQuery } from "@tanstack/react-query";
import type { Booking } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  Calendar, 
  Package, 
  AlertTriangle,
  User,
  TrendingUp
} from "lucide-react";

export default function DashboardStats() {
  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalRevenue: number;
    activeRentals: number;
    availableItems: number;
    overdueReturns: number;
  }>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentBookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  if (statsLoading || bookingsLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-muted rounded-xl"></div>
            <div className="h-64 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const recent5Bookings = recentBookings.slice(0, 5);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <div className="flex items-center space-x-4">
          <Select defaultValue="30">
            <SelectTrigger className="w-40" data-testid="select-period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-revenue">
                  ₹{stats?.totalRevenue?.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 text-sm font-medium">+15.3%</span>
              <span className="text-muted-foreground text-sm ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Rentals</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-active-rentals">
                  {stats?.activeRentals || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-blue-600 text-sm font-medium">+8.1%</span>
              <span className="text-muted-foreground text-sm ml-2">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Available Items</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-available-items">
                  {stats?.availableItems || 0}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-purple-600 text-sm font-medium">89%</span>
              <span className="text-muted-foreground text-sm ml-2">availability rate</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Overdue Returns</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-overdue-returns">
                  {stats?.overdueReturns || 0}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-red-600 text-sm font-medium">Needs attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recent5Bookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No bookings found</p>
              ) : (
                recent5Bookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground" data-testid={`text-customer-${booking.id}`}>
                          {booking.customerName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.items?.length || 0} items
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground" data-testid={`text-amount-${booking.id}`}>
                        ${parseFloat(booking.totalAmount).toFixed(0)}
                      </p>
                      <Badge
                        variant={booking.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.overdueReturns > 0 && (
                <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <p className="font-medium text-foreground">Overdue Returns</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.overdueReturns} items are overdue for return
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <Package className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="font-medium text-foreground">Inventory Status</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.availableItems || 0} items available for rental
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-foreground">Revenue Growing</p>
                  <p className="text-sm text-muted-foreground">
                    Monthly revenue increased by 15.3%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
