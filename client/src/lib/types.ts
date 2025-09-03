export interface CartItem {
  id: string;
  type: "costume" | "accessory";
  name: string;
  pricePerDay: string;
  size?: string;
  quantity: number;
  imageUrl?: string;
}

export interface RentalDates {
  startDate: Date;
  endDate: Date;
}

export interface BookingFormData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  startDate: Date;
  endDate: Date;
  items: CartItem[];
  totalAmount: number;
  securityDeposit: number;
}

export interface DashboardStats {
  totalRevenue: number;
  activeRentals: number;
  availableItems: number;
  overdueReturns: number;
}

export type ItemStatus = "available" | "rented" | "cleaning" | "damaged";
export type BookingStatus = "active" | "completed" | "overdue" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "refunded";
