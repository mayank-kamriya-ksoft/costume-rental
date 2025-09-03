import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { 
  Calendar, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  IndianRupee,
  User,
  Phone,
  Mail,
  Eye,
  ArrowLeft
} from "lucide-react";
import type { Booking, BookingItem } from "@shared/schema";

type BookingWithItems = Booking & { items: BookingItem[] };

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<BookingWithItems | null>(null);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
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

        {/* Orders Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Your Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                        onViewDetails={() => setSelectedBooking(booking)}
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
                        onViewDetails={() => setSelectedBooking(booking)}
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
                        onViewDetails={() => setSelectedBooking(booking)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <OrderDetailsView 
              booking={selectedBooking} 
              onClose={() => setSelectedBooking(null)}
            />
          )}
        </DialogContent>
      </Dialog>

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

function OrderDetailsView({ booking, onClose }: { booking: BookingWithItems; onClose: () => void }) {
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
    <div className="space-y-6" data-testid="order-details">
      {/* Header with status and booking ID */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Booking #{booking.id.slice(-8)}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {getStatusIcon(booking.status)}
              <Badge className={getStatusColor(booking.status)} data-testid="order-status">
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
            <Badge className={getPaymentStatusColor(booking.paymentStatus)} data-testid="payment-status">
              {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-details">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span data-testid="customer-name">{booking.customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span data-testid="customer-email">{booking.customerEmail}</span>
          </div>
          {booking.customerPhone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span data-testid="customer-phone">{booking.customerPhone}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rental Period */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Rental Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-semibold" data-testid="start-date">
                {format(new Date(booking.startDate), 'PPP')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-semibold" data-testid="end-date">
                {format(new Date(booking.endDate), 'PPP')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rented Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Rented Items ({booking.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {booking.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg" data-testid={`item-detail-${index}`}>
                <div>
                  <h4 className="font-semibold">{item.itemName}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Type: {item.itemType}</span>
                    {item.size && <span>Size: {item.size}</span>}
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{item.pricePerDay}/day</div>
                  <div className="text-sm text-muted-foreground">
                    Total: ₹{(parseFloat(item.pricePerDay) * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Amount</span>
              <span className="font-semibold" data-testid="detail-total-amount">₹{booking.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Security Deposit</span>
              <span data-testid="detail-security-deposit">₹{booking.securityDeposit}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Grand Total</span>
              <span data-testid="grand-total">₹{(parseFloat(booking.totalAmount) + parseFloat(booking.securityDeposit)).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {booking.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Special Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic" data-testid="booking-notes">
              "{booking.notes}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}