import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter
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

const ITEMS_PER_PAGE = 15;

export default function EnhancedBookingManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allBookings = [], isLoading } = useQuery<BookingType[]>({
    queryKey: ["/api/bookings"],
  });

  // Filter and paginate bookings
  const filteredBookings = allBookings.filter((booking) => {
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    const matchesSearch = !searchQuery || 
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

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
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
      case "overdue":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
      case "cancelled":
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800";
      case "refunded":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    updateBookingStatusMutation.mutate({ bookingId, status: newStatus });
  };

  const isOverdue = (endDate: string, status: string) => {
    return status === "active" && new Date(endDate) < new Date();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setStatusFilter("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Booking Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Showing {currentBookings.length} of {filteredBookings.length} bookings
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by customer, email, or booking ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 w-full sm:w-80 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              data-testid="input-search-bookings"
            />
          </div>
          
          {/* Status Filter */}
          <Select value={statusFilter || "all"} onValueChange={(value) => {
            setStatusFilter(value === "all" ? "" : value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" data-testid="select-status-filter">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          {(statusFilter || searchQuery) && (
            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="border-slate-200 dark:border-slate-700"
              data-testid="button-reset-filters"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded flex-1"></div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : currentBookings.length === 0 ? (
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {searchQuery || statusFilter ? "No matching bookings found" : "No bookings found"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {searchQuery || statusFilter 
                ? "Try adjusting your search or filter criteria"
                : "No bookings have been made yet"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentBookings.map((booking: Booking) => {
              const isBookingOverdue = isOverdue(booking.endDate, booking.status);
              return (
                <Card 
                  key={booking.id} 
                  className={`${isBookingOverdue ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/10" : "border-slate-200 dark:border-slate-700"} bg-white dark:bg-slate-800 hover:shadow-lg transition-all duration-200`}
                  data-testid={`booking-card-${booking.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {booking.customerName}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Mail className="h-3 w-3" />
                          {booking.customerEmail}
                        </div>
                        {booking.customerPhone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Phone className="h-3 w-3" />
                            {booking.customerPhone}
                          </div>
                        )}
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(booking.status)} data-testid={`status-${booking.id}`}>
                          {booking.status}
                        </Badge>
                        <Badge className={getPaymentStatusColor(booking.paymentStatus)} data-testid={`payment-${booking.id}`}>
                          {booking.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium">Start:</span>
                        </div>
                        <div className="text-slate-900 dark:text-slate-100 pl-5">
                          {format(new Date(booking.startDate), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">End:</span>
                        </div>
                        <div className="text-slate-900 dark:text-slate-100 pl-5">
                          {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <IndianRupee className="h-3 w-3" />
                          <span className="font-medium">Total:</span>
                        </div>
                        <div className="text-slate-900 dark:text-slate-100 pl-5 font-semibold">
                          ${parseFloat(booking.totalAmount).toFixed(2)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <CheckCircle className="h-3 w-3" />
                          <span className="font-medium">Deposit:</span>
                        </div>
                        <div className="text-slate-900 dark:text-slate-100 pl-5 font-semibold">
                          ${parseFloat(booking.securityDeposit).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Items ({booking.items?.length || 0}):
                      </div>
                      <div className="space-y-1">
                        {booking.items?.slice(0, 3).map((item, index) => (
                          <div key={index} className="text-sm text-slate-600 dark:text-slate-400 flex justify-between">
                            <span>{item.itemName} {item.size && `(${item.size})`}</span>
                            <span>×{item.quantity}</span>
                          </div>
                        ))}
                        {booking.items?.length > 3 && (
                          <div className="text-sm text-slate-500 dark:text-slate-500 italic">
                            +{booking.items.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Select
                        value={booking.status}
                        onValueChange={(newStatus) => handleStatusChange(booking.id, newStatus)}
                        disabled={updateBookingStatusMutation.isPending}
                      >
                        <SelectTrigger className="flex-1 h-9 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600" data-testid={`status-select-${booking.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Page {currentPage} of {totalPages} ({filteredBookings.length} total results)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-slate-200 dark:border-slate-700"
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={currentPage === pageNum 
                          ? "bg-blue-600 hover:bg-blue-700 text-white" 
                          : "border-slate-200 dark:border-slate-700"
                        }
                        data-testid={`button-page-${pageNum}`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-slate-200 dark:border-slate-700"
                  data-testid="button-next-page"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}