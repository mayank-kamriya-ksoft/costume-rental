import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";
import { format, addDays } from "date-fns";
import { 
  Search, 
  Plus, 
  User, 
  ShoppingCart, 
  Calendar, 
  DollarSign,
  Package,
  CreditCard,
  X,
  UserPlus,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

type Customer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  isActive: boolean;
};

type InventoryItem = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  pricePerDay: string;
  securityDeposit: string;
  sizes: string[];
  status: string;
  imageUrl?: string;
  type: 'costume' | 'accessory';
};

type CartItem = {
  id: string;
  name: string;
  type: 'costume' | 'accessory';
  pricePerDay: number;
  size?: string;
  quantity: number;
};

type NewCustomerData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  password: string;
};

export default function PointOfSale() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [itemSearch, setItemSearch] = useState("");
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 3), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState("");
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState<NewCustomerData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    password: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Search customers
  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/admin/customers", customerSearch],
    queryFn: async () => {
      const url = `/api/admin/customers${customerSearch ? `?search=${customerSearch}` : ''}`;
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    },
    enabled: customerSearch.length >= 2 || customerSearch === "", // Search when at least 2 characters or show all
  });

  // Fetch inventory items
  const { data: costumes = [] } = useQuery({
    queryKey: ["/api/costumes", itemSearch],
    queryFn: async () => {
      const url = `/api/costumes${itemSearch ? `?search=${itemSearch}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch costumes');
      return response.json();
    },
  });

  const { data: accessories = [] } = useQuery({
    queryKey: ["/api/accessories", itemSearch],
    queryFn: async () => {
      const url = `/api/accessories${itemSearch ? `?search=${itemSearch}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch accessories');
      return response.json();
    },
  });

  // Combine inventory items
  const inventoryItems: InventoryItem[] = [
    ...costumes.map((item: any) => ({ ...item, type: 'costume' as const })),
    ...accessories.map((item: any) => ({ ...item, type: 'accessory' as const }))
  ].filter(item => 
    item.status === 'available' && 
    (itemSearch === "" || item.name.toLowerCase().includes(itemSearch.toLowerCase()))
  );

  // Create new customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: async (data: NewCustomerData) => {
      const response = await apiRequest("POST", "/api/admin/customers", data);
      return response.json();
    },
    onSuccess: (newCustomer) => {
      toast({ 
        title: "Success", 
        description: "Customer created successfully!" 
      });
      setSelectedCustomer(newCustomer);
      setIsNewCustomerDialogOpen(false);
      setNewCustomerData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        password: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/customers"] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create customer", 
        variant: "destructive" 
      });
    },
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      toast({ 
        title: "Success", 
        description: "Booking created successfully!" 
      });
      // Reset the form
      setCart([]);
      setSelectedCustomer(null);
      setNotes("");
      setStartDate(format(new Date(), 'yyyy-MM-dd'));
      setEndDate(format(addDays(new Date(), 3), 'yyyy-MM-dd'));
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create booking", 
        variant: "destructive" 
      });
    },
  });

  const addToCart = (item: InventoryItem, size?: string) => {
    const existingItem = cart.find(cartItem => 
      cartItem.id === item.id && cartItem.size === size
    );

    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id && cartItem.size === size
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, {
        id: item.id,
        name: item.name,
        type: item.type,
        pricePerDay: parseFloat(item.pricePerDay),
        size,
        quantity: 1
      }]);
    }
    
    toast({ 
      title: "Item Added", 
      description: `${item.name} added to cart${size ? ` (Size: ${size})` : ''}` 
    });
  };

  const removeFromCart = (itemId: string, size?: string) => {
    setCart(cart.filter(item => !(item.id === itemId && item.size === size)));
  };

  const updateCartQuantity = (itemId: string, size: string | undefined, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, size);
    } else {
      setCart(cart.map(item =>
        item.id === itemId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const calculateTotal = () => {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const days = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 3600 * 24));
    
    return cart.reduce((total, item) => {
      return total + (item.pricePerDay * item.quantity * days);
    }, 0);
  };

  const handleCreateBooking = () => {
    if (!selectedCustomer) {
      toast({
        title: "Error",
        description: "Please select a customer first",
        variant: "destructive"
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to cart first",
        variant: "destructive"
      });
      return;
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const days = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 3600 * 24));
    
    const totalAmount = calculateTotal();
    const securityDeposit = totalAmount * 0.5; // 50% security deposit

    const bookingData = {
      userId: selectedCustomer.id,
      customerName: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
      customerEmail: selectedCustomer.email,
      customerPhone: selectedCustomer.phone || "",
      startDate: startDateObj.toISOString(),
      endDate: endDateObj.toISOString(),
      totalAmount,
      securityDeposit,
      status: "active",
      paymentStatus: "pending",
      notes,
      items: cart.map(item => ({
        itemType: item.type,
        itemId: item.id,
        itemName: item.name,
        size: item.size || "",
        pricePerDay: item.pricePerDay,
        quantity: item.quantity
      }))
    };

    createBookingMutation.mutate(bookingData);
  };

  const handleCreateCustomer = () => {
    if (!newCustomerData.firstName || !newCustomerData.lastName || 
        !newCustomerData.email || !newCustomerData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Generate a temporary password
    const tempPassword = `temp${Math.random().toString(36).substring(7)}`;
    createCustomerMutation.mutate({ 
      ...newCustomerData, 
      password: tempPassword 
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Customer Selection */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Search Customer</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="pl-10"
                  data-testid="input-customer-search"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCustomer?.id === customer.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedCustomer(customer)}
                  data-testid={`customer-${customer.id}`}
                >
                  <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {customer.email}
                    </span>
                    {customer.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {customerSearch.length >= 2 && customers.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No customers found matching "{customerSearch}"
                </div>
              )}
            </div>

            <Dialog open={isNewCustomerDialogOpen} onOpenChange={setIsNewCustomerDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" data-testid="button-add-customer">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name *</Label>
                      <Input
                        value={newCustomerData.firstName}
                        onChange={(e) => setNewCustomerData({ ...newCustomerData, firstName: e.target.value })}
                        data-testid="input-first-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name *</Label>
                      <Input
                        value={newCustomerData.lastName}
                        onChange={(e) => setNewCustomerData({ ...newCustomerData, lastName: e.target.value })}
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={newCustomerData.email}
                      onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                      data-testid="input-email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Phone *</Label>
                    <Input
                      value={newCustomerData.phone}
                      onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                      data-testid="input-phone"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      value={newCustomerData.address}
                      onChange={(e) => setNewCustomerData({ ...newCustomerData, address: e.target.value })}
                      data-testid="input-address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        value={newCustomerData.city}
                        onChange={(e) => setNewCustomerData({ ...newCustomerData, city: e.target.value })}
                        data-testid="input-city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Postal Code</Label>
                      <Input
                        value={newCustomerData.postalCode}
                        onChange={(e) => setNewCustomerData({ ...newCustomerData, postalCode: e.target.value })}
                        data-testid="input-postal-code"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleCreateCustomer}
                      disabled={createCustomerMutation.isPending}
                      className="flex-1"
                      data-testid="button-save-customer"
                    >
                      {createCustomerMutation.isPending ? "Creating..." : "Create Customer"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsNewCustomerDialogOpen(false)}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {selectedCustomer && (
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                <CardContent className="p-4">
                  <div className="font-medium text-blue-900 dark:text-blue-100">
                    Selected Customer
                  </div>
                  <div className="text-blue-800 dark:text-blue-200">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-300">
                    {selectedCustomer.email}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Inventory Selection */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Search Items</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search costumes and accessories..."
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  className="pl-10"
                  data-testid="input-item-search"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {inventoryItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600 mb-2">
                        {item.description}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                        <span className="text-sm font-medium text-green-600">
                          ${item.pricePerDay}/day
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {item.sizes.length > 0 ? (
                    <div className="space-y-2">
                      <Label className="text-xs">Available Sizes:</Label>
                      <div className="flex flex-wrap gap-1">
                        {item.sizes.map((size) => (
                          <Button
                            key={size}
                            size="sm"
                            variant="outline"
                            onClick={() => addToCart(item, size)}
                            className="h-8 px-3 text-xs"
                            data-testid={`button-add-${item.id}-${size}`}
                          >
                            {size}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => addToCart(item)}
                      className="w-full"
                      data-testid={`button-add-${item.id}`}
                    >
                      Add to Cart
                    </Button>
                  )}
                </div>
              ))}
              
              {inventoryItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {itemSearch ? `No items found matching "${itemSearch}"` : "No available items"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart and Checkout */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart ({cart.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Cart is empty
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${item.size || 'no-size'}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      {item.size && <div className="text-xs text-gray-600">Size: {item.size}</div>}
                      <div className="text-xs text-green-600">${item.pricePerDay}/day</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.size, item.quantity - 1)}
                          className="h-6 w-6 p-0"
                          data-testid={`button-decrease-${item.id}`}
                        >
                          -
                        </Button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.size, item.quantity + 1)}
                          className="h-6 w-6 p-0"
                          data-testid={`button-increase-${item.id}`}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        data-testid={`button-remove-${item.id}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Rental Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  data-testid="input-start-date"
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  data-testid="input-end-date"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions or notes..."
                rows={3}
                data-testid="textarea-notes"
              />
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Days:</span>
                  <span>
                    {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24))}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Security Deposit (50%):</span>
                  <span>${(calculateTotal() * 0.5).toFixed(2)}</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleCreateBooking}
              disabled={!selectedCustomer || cart.length === 0 || createBookingMutation.isPending}
              className="w-full"
              data-testid="button-create-booking"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {createBookingMutation.isPending ? "Creating..." : "Create Booking"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}