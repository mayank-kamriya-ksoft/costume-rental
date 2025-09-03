import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ArrowLeft
} from "lucide-react";
import type { Booking, BookingItem } from "@shared/schema";

type BookingWithItems = Booking & { items: BookingItem[] };

export default function OrderDetails() {
  const [, params] = useRoute("/order/:id");
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<BookingWithItems | null>(null);

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<BookingWithItems[]>({
    queryKey: ["/api/user/bookings"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (params?.id && bookings.length > 0) {
      const booking = bookings.find(b => b.id === params.id);
      setSelectedBooking(booking || null);
    }
  }, [params?.id, bookings]);

  // Redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  if (authLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!selectedBooking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button onClick={() => setLocation("/dashboard")} data-testid="button-back-dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button and Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/dashboard")}
            className="mb-4"
            data-testid="button-back-to-dashboard"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Order Details</h1>
              <p className="text-muted-foreground">Booking #{selectedBooking.id.slice(-8)}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(selectedBooking.status)}
                <Badge className={getStatusColor(selectedBooking.status)} data-testid="order-status">
                  {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                </Badge>
              </div>
              <Badge className={getPaymentStatusColor(selectedBooking.paymentStatus)} data-testid="payment-status">
                {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold" data-testid="customer-name">{selectedBooking.customerName}</p>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold" data-testid="customer-email">{selectedBooking.customerEmail}</p>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                </div>
              </div>
              {selectedBooking.customerPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold" data-testid="customer-phone">{selectedBooking.customerPhone}</p>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rental Period */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Rental Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                  <p className="text-lg font-semibold" data-testid="start-date">
                    {format(new Date(selectedBooking.startDate), 'EEEE, MMMM do, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">End Date</p>
                  <p className="text-lg font-semibold" data-testid="end-date">
                    {format(new Date(selectedBooking.endDate), 'EEEE, MMMM do, yyyy')}
                  </p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Duration</p>
                  <p className="font-semibold">
                    {Math.ceil((new Date(selectedBooking.endDate).getTime() - new Date(selectedBooking.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="text-lg font-semibold" data-testid="detail-total-amount">₹{selectedBooking.totalAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Security Deposit</span>
                  <span className="font-semibold" data-testid="detail-security-deposit">₹{selectedBooking.securityDeposit}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-lg font-semibold">Grand Total</span>
                  <span className="text-xl font-bold text-primary" data-testid="grand-total">
                    ₹{(parseFloat(selectedBooking.totalAmount) + parseFloat(selectedBooking.securityDeposit)).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes (if any) */}
          {selectedBooking.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Special Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic text-lg" data-testid="booking-notes">
                  "{selectedBooking.notes}"
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Rented Items - Full Width */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Rented Items ({selectedBooking.items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedBooking.items.map((item, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg border" data-testid={`item-detail-${index}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold">{item.itemName}</h4>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">₹{item.pricePerDay}/day</div>
                      <div className="text-sm text-muted-foreground">
                        Total: ₹{(parseFloat(item.pricePerDay) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Type:</span>
                      <Badge variant="secondary">{item.itemType}</Badge>
                    </div>
                    {item.size && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Size:</span>
                        <Badge variant="outline">{item.size}</Badge>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Quantity:</span>
                      <Badge variant="outline">{item.quantity}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}