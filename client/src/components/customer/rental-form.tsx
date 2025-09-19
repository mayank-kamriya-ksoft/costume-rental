import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, differenceInDays, addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import type { Costume, Accessory } from "@shared/schema";

const rentalFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  size: z.string().optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type RentalFormData = z.infer<typeof rentalFormSchema>;

interface RentalFormProps {
  item: Costume | Accessory;
  type: "costume" | "accessory";
  selectedSize?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RentalForm({ item, type, selectedSize, onSuccess, onCancel }: RentalFormProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RentalFormData>({
    resolver: zodResolver(rentalFormSchema),
    defaultValues: {
      size: selectedSize || "",
    },
  });

  // Pre-fill form with authenticated user data
  useEffect(() => {
    if (isAuthenticated && user) {
      setValue("customerName", `${user.firstName} ${user.lastName}`);
      setValue("customerEmail", user.email);
      if (user.phone) {
        setValue("customerPhone", user.phone);
      }
    }
  }, [isAuthenticated, user, setValue]);

  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");

  const createBookingMutation = useMutation({
    mutationFn: async (data: RentalFormData) => {
      const rentalDays = differenceInDays(data.endDate, data.startDate) || 1;
      const pricePerDay = parseFloat(item.pricePerDay);
      const totalAmount = pricePerDay * rentalDays;
      const securityDeposit = totalAmount * 0.5; // 50% security deposit

      const booking = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone || "",
        startDate: data.startDate,
        endDate: data.endDate,
        totalAmount: totalAmount.toString(),
        securityDeposit: securityDeposit.toString(),
        status: "active",
        paymentStatus: "paid", // Mock payment as complete
      };

      const bookingItem = {
        itemType: type,
        itemId: item.id,
        itemName: item.name,
        size: data.size || "",
        pricePerDay: item.pricePerDay,
        quantity: 1,
      };

      return await apiRequest("POST", "/api/bookings", {
        booking,
        items: [bookingItem],
      });
    },
    onSuccess: () => {
      toast({
        title: "🎉 Booking Confirmed!",
        description: "Your rental has been successfully booked and is ready for pickup!",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/costumes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/accessories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "❌ Booking Failed",
        description: error.message || "Unable to process your booking. Please check your details and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RentalFormData) => {
    createBookingMutation.mutate(data);
  };

  const calculateTotal = () => {
    if (!watchedStartDate || !watchedEndDate) return 0;
    const days = differenceInDays(watchedEndDate, watchedStartDate) || 1;
    return parseFloat(item.pricePerDay) * days;
  };

  const calculateDeposit = () => {
    return calculateTotal() * 0.5;
  };

  const sizes = Array.isArray(item.sizes) ? item.sizes : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {isAuthenticated && user && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Your information has been automatically filled from your account</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="customerName">Full Name *</Label>
        <Input
          id="customerName"
          {...register("customerName")}
          placeholder="Enter your full name"
          className={isAuthenticated ? "bg-gray-50 dark:bg-gray-800" : ""}
          readOnly={isAuthenticated}
          data-testid="input-customer-name"
        />
        {errors.customerName && (
          <p className="text-sm text-destructive">{errors.customerName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerEmail">Email *</Label>
        <Input
          id="customerEmail"
          type="email"
          {...register("customerEmail")}
          placeholder="Enter your email"
          className={isAuthenticated ? "bg-gray-50 dark:bg-gray-800" : ""}
          readOnly={isAuthenticated}
          data-testid="input-customer-email"
        />
        {errors.customerEmail && (
          <p className="text-sm text-destructive">{errors.customerEmail.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerPhone">Phone</Label>
        <Input
          id="customerPhone"
          {...register("customerPhone")}
          placeholder="Enter your phone number"
          className={isAuthenticated ? "bg-gray-50 dark:bg-gray-800" : ""}
          readOnly={isAuthenticated}
          data-testid="input-customer-phone"
        />
      </div>

      {sizes.length > 0 && (
        <div className="space-y-2">
          <Label>Size</Label>
          <Select onValueChange={(value) => setValue("size", value)} defaultValue={selectedSize}>
            <SelectTrigger data-testid="select-size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
                data-testid="button-start-date"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  setValue("startDate", date || new Date());
                  if (date && (!endDate || endDate <= date)) {
                    const newEndDate = addDays(date, 1);
                    setEndDate(newEndDate);
                    setValue("endDate", newEndDate);
                  }
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.startDate && (
            <p className="text-sm text-destructive">{errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>End Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
                data-testid="button-end-date"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  setValue("endDate", date || new Date());
                }}
                disabled={(date) => !startDate || date <= startDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.endDate && (
            <p className="text-sm text-destructive">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Pricing Summary */}
      {watchedStartDate && watchedEndDate && (
        <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>Rental Duration:</span>
            <span>{differenceInDays(watchedEndDate, watchedStartDate) || 1} days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Daily Rate:</span>
            <span>₹{parseFloat(item.pricePerDay).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Subtotal:</span>
            <span>₹{calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Security Deposit:</span>
            <span>₹{calculateDeposit().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total Due:</span>
            <span>₹{(calculateTotal() + calculateDeposit()).toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          data-testid="button-cancel"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={createBookingMutation.isPending}
          data-testid="button-confirm-booking"
        >
          {createBookingMutation.isPending ? "Processing..." : "Confirm Booking"}
        </Button>
      </div>
    </form>
  );
}
