import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  DollarSign,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import type { Booking as BookingType } from "@shared/schema";

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  startDate: string;
  endDate: string;
  totalAmount: string;
  securityDeposit: string;
  status: string;
  paymentStatus: string;
  items: {
    itemName: string;
    itemType: string;
    size?: string;
    pricePerDay: string;
    quantity: number;
  }[];
  createdAt: string;
}

export default function BookingManagement() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery<BookingType[]>({
    queryKey: ["/api/bookings", statusFilter ? { status: statusFilter } : {}],
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      return await apiRequest("PATCH", `/api/bookings/${bookingId}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Booking Updated",
        description: "Booking status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    updateBookingStatusMutation.mutate({ bookingId, status: newStatus });
  };

  const isOverdue = (endDate: string, status: string) => {
    return status === "active" && new Date(endDate) < new Date();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Booking Management</h1>
        <div className="flex space-x-3">
          <Select value={statusFilter || "all-bookings"} onValueChange={(value) => setStatusFilter(value === "all-bookings" ? "" : value)}>
            <SelectTrigger className="w-40" data-testid="select-status-filter">
              <SelectValue placeholder="All Bookings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-bookings">All Bookings</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-16 bg-muted rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-muted rounded flex-1"></div>
                    <div className="h-8 bg-muted rounded w-20"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No bookings found</h3>
            <p className="text-muted-foreground">
              {statusFilter ? `No ${statusFilter} bookings at the moment` : "No bookings have been made yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((booking: Booking) => {
            const isBookingOverdue = isOverdue(booking.endDate, booking.status);
            return (
              <Card 
                key={booking.id} 
                className={`${isBookingOverdue ? "border-red-200 bg-red-50/50" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(isBookingOverdue ? "overdue" : booking.status)}>
                        {isBookingOverdue ? "Overdue" : booking.status}
                      </Badge>
                      <Badge variant="outline" className={getPaymentStatusColor(booking.paymentStatus)}>
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      #{booking.id.slice(-8)}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground" data-testid={`text-customer-${booking.id}`}>
                        {booking.customerName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {booking.customerEmail}
                        </div>
                        {booking.customerPhone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {booking.customerPhone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rental Items */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-medium text-foreground mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Items Rented:
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                      {booking.items.map((item, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span>
                            • {item.itemName} {item.size && `(Size ${item.size})`}
                          </span>
                          <span className="font-medium">
                            ${parseFloat(item.pricePerDay).toFixed(0)}/day
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Rental Period:</span>
                        <p className="font-medium text-foreground">
                          {format(new Date(booking.startDate), "MMM dd")} - {format(new Date(booking.endDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Amount:</span>
                        <p className="font-medium text-foreground flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {parseFloat(booking.totalAmount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    {booking.status === "active" && (
                      <Button
                        onClick={() => handleStatusChange(booking.id, "completed")}
                        className="flex-1"
                        disabled={updateBookingStatusMutation.isPending}
                        data-testid={`button-complete-${booking.id}`}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Returned
                      </Button>
                    )}
                    
                    {isBookingOverdue && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          // Send reminder functionality would go here
                          toast({
                            title: "Reminder Sent",
                            description: `Overdue reminder sent to ${booking.customerName}`,
                          });
                        }}
                        className="flex-1"
                        data-testid={`button-reminder-${booking.id}`}
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Send Reminder
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      className="px-4"
                      onClick={() => {
                        // Contact customer functionality would go here
                        window.location.href = `mailto:${booking.customerEmail}?subject=Regarding your rental booking #${booking.id.slice(-8)}`;
                      }}
                      data-testid={`button-contact-${booking.id}`}
                    >
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
