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
  IndianRupee,
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
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("available");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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
  const [selectedSizes, setSelectedSizes] = useState<{ [itemId: string]: string }>({});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Search customers - only when user types
  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/admin/customers", customerSearch],
    queryFn: async () => {
      const url = `/api/admin/customers${customerSearch ? `?search=${customerSearch}` : ''}`;
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    },
    enabled: customerSearch.length >= 2, // Only search when user types at least 2 characters
  });

  // Fetch inventory items - only when user searches
  const { data: costumes = [] } = useQuery({
    queryKey: ["/api/costumes", itemSearch],
    queryFn: async () => {
      const url = `/api/costumes${itemSearch ? `?search=${itemSearch}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch costumes');
      return response.json();
    },
    enabled: itemSearch.length >= 2, // Only search when user types
  });

  const { data: accessories = [] } = useQuery({
    queryKey: ["/api/accessories", itemSearch],
    queryFn: async () => {
      const url = `/api/accessories${itemSearch ? `?search=${itemSearch}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch accessories');
      return response.json();
    },
    enabled: itemSearch.length >= 2, // Only search when user types
  });

  // Fetch categories for filtering
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  // Combine and filter inventory items
  const allInventoryItems: InventoryItem[] = [
    ...costumes.map((item: any) => ({ ...item, type: 'costume' as const })),
    ...accessories.map((item: any) => ({ ...item, type: 'accessory' as const }))
  ];

  const filteredItems = allInventoryItems.filter(item => {
    const matchesSearch = itemSearch === "" || item.name.toLowerCase().includes(itemSearch.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.categoryId === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const inventoryItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Create new customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: async (data: NewCustomerData) => {
      const response = await apiRequest("POST", "/api/admin/customers", data);
      return response.json();
    },
    onSuccess: (newCustomer) => {
      toast({ 
        title: "✅ Customer Created", 
        description: "New customer has been successfully added to the system!",
        variant: "success"
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
        title: "❌ Failed to Create Customer", 
        description: error.message || "Please check the information and try again.", 
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
        title: "🎉 Booking Created Successfully!", 
        description: "The rental booking has been processed and confirmed.",
        variant: "success"
      });
      // Invalidate bookings cache to refresh admin/bookings page
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      // Reset the form
      setCart([]);
      setSelectedCustomer(null);
      setNotes("");
      setStartDate(format(new Date(), 'yyyy-MM-dd'));
      setEndDate(format(addDays(new Date(), 3), 'yyyy-MM-dd'));
    },
    onError: (error: any) => {
      toast({ 
        title: "❌ Booking Failed", 
        description: error.message || "Please check the details and try again.", 
        variant: "destructive" 
      });
    },
  });

  // Helper function to handle size selection
  const handleSizeSelect = (itemId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [itemId]: size
    }));
  };

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
      booking: {
        userId: selectedCustomer.id,
        customerName: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
        customerEmail: selectedCustomer.email,
        customerPhone: selectedCustomer.phone || "",
        startDate: startDateObj,
        endDate: endDateObj,
        totalAmount,
        securityDeposit,
        status: "active",
        paymentStatus: "pending",
        notes
      },
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
    <div className="overflow-hidden p-6">
      <div className="grid grid-cols-12 gap-6 h-3/4 mb-6">
        {/* Left Side - 2/3 of screen */}
        <div className="col-span-8 flex flex-col gap-6">
          {/* Top: Inventory Search */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Inventory Search
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="space-y-3 h-full flex flex-col">
                <div className="space-y-2">
                  <Label>Search Items</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Start typing to search costumes and accessories..."
                      value={itemSearch}
                      onChange={(e) => setItemSearch(e.target.value)}
                      className="pl-10"
                      data-testid="input-item-search"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-sm">Category</Label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Available" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Type</Label>
                    <Select value="all" onValueChange={() => {}}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="costume">Costumes</SelectItem>
                        <SelectItem value="accessory">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {itemSearch.length < 2 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">Search for Costumes & Accessories</h3>
                      <p className="text-sm">Start typing to find existing costumes</p>
                    </div>
                  ) : inventoryItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">No items found</h3>
                      <p className="text-sm">No items found matching "{itemSearch}"</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {inventoryItems.map((item) => (
                        <Card key={item.id} className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold text-base">{item.name}</h4>
                                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {item.type}
                                  </Badge>
                                  <Badge 
                                    variant={item.status === 'available' ? 'default' : 'secondary'} 
                                    className="text-xs"
                                  >
                                    {item.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg text-green-600">₹{item.pricePerDay}</p>
                                <p className="text-xs text-gray-500">per day</p>
                                <p className="text-xs text-gray-500">Deposit: ₹{item.securityDeposit}</p>
                              </div>
                            </div>
                            
                            {item.sizes && item.sizes.length > 0 && (
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Available Sizes</Label>
                                <div className="flex flex-wrap gap-2">
                                  {item.sizes.map((size) => (
                                    <Button
                                      key={size}
                                      size="sm"
                                      variant={selectedSizes[item.id] === size ? "default" : "outline"}
                                      onClick={() => handleSizeSelect(item.id, size)}
                                      className="text-sm h-8 px-3"
                                    >
                                      {size}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <Button
                              size="sm"
                              onClick={() => addToCart(item, selectedSizes[item.id])}
                              disabled={item.status !== 'available' || (item.sizes.length > 0 && !selectedSizes[item.id])}
                              className="w-full h-9"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom: Customer Search */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Customer Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="space-y-3 h-full flex flex-col">
                <div className="space-y-2">
                  <Label>Search Customer</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Start typing to search customers..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="pl-10"
                      data-testid="input-customer-search"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                  {customerSearch.length < 2 ? (
                    <div className="text-center py-12 text-gray-500">
                      <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">Search for Customers</h3>
                      <p className="text-sm">Start typing to find existing customers</p>
                    </div>
                  ) : customers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">No customers found</h3>
                      <p className="text-sm">No customers found matching "{customerSearch}"</p>
                    </div>
                  ) : (
                    customers.map((customer) => (
                      <div
                        key={customer.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedCustomer?.id === customer.id 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedCustomer(customer)}
                        data-testid={`customer-${customer.id}`}
                      >
                        <div className="font-semibold text-base">{customer.firstName} {customer.lastName}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-4 mt-1">
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
                    ))
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
                    <div className="space-y-4 p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Name *</Label>
                          <Input
                            value={newCustomerData.firstName}
                            onChange={(e) => setNewCustomerData({ ...newCustomerData, firstName: e.target.value })}
                            placeholder="Enter first name"
                            data-testid="input-first-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name *</Label>
                          <Input
                            value={newCustomerData.lastName}
                            onChange={(e) => setNewCustomerData({ ...newCustomerData, lastName: e.target.value })}
                            placeholder="Enter last name"
                            data-testid="input-last-name"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Email Address *</Label>
                        <Input
                          type="email"
                          value={newCustomerData.email}
                          onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                          placeholder="Enter email address"
                          data-testid="input-email"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Phone Number *</Label>
                        <Input
                          value={newCustomerData.phone}
                          onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                          placeholder="Enter phone number"
                          data-testid="input-phone"
                        />
                      </div>
                      
                      <div className="flex gap-3 pt-4">
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
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="font-semibold text-blue-900">Selected Customer</div>
                      <div className="text-blue-800">{selectedCustomer.firstName} {selectedCustomer.lastName}</div>
                      <div className="text-sm text-blue-600">{selectedCustomer.email}</div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - 1/3 of screen: Cart */}
        <div className="col-span-4">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
                Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="space-y-3 h-full flex flex-col">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-gray-500 flex-1 flex items-center justify-center">
                    <div>
                      <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">Cart is empty</h3>
                      <p className="text-sm">Add items from inventory to get started</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-3">
                      {cart.map((item, index) => (
                        <Card key={`${item.id}-${item.size}`} className="p-3 border-l-4 border-l-orange-500">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{item.name}</h4>
                                <p className="text-xs text-gray-500">
                                  {item.type} {item.size && `• ${item.size}`}
                                </p>
                                <p className="text-sm font-medium text-green-600">₹{item.pricePerDay}/day</p>
                              </div>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeFromCart(item.id, item.size)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-xs">Qty:</Label>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCartQuantity(item.id, item.size, item.quantity - 1)}
                                  className="h-7 w-7 p-0"
                                >
                                  -
                                </Button>
                                <span className="text-sm w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCartQuantity(item.id, item.size, item.quantity + 1)}
                                  className="h-7 w-7 p-0"
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="pt-3 border-t">
                      <div className="text-xl font-bold flex items-center text-green-600">
                        <IndianRupee className="h-5 w-5 mr-1" />
                        Total: ₹{calculateTotal().toFixed(2)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {cart.reduce((total, item) => total + item.quantity, 0)} items
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom: Rental Details */}
      <Card className="h-1/4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-purple-600" />
            Rental Details & Booking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10"
                data-testid="input-start-date"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10"
                data-testid="input-end-date"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="text-sm font-medium">Notes (Optional)</Label>
              <Input
                placeholder="Any special instructions or requirements..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-10"
                data-testid="textarea-notes"
              />
            </div>
          </div>
          
          {cart.length > 0 && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-base mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span className="font-medium">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rental Days:</span>
                    <span className="font-medium">
                      {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium text-green-600">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Deposit (50%):</span>
                    <span className="font-medium">₹{(calculateTotal() * 0.5).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="font-bold text-lg text-green-600">₹{(calculateTotal() * 1.5).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Button
                  onClick={handleCreateBooking}
                  disabled={!selectedCustomer || cart.length === 0 || createBookingMutation.isPending}
                  className="w-full h-16 text-lg"
                  data-testid="button-create-booking"
                >
                  <CreditCard className="h-6 w-6 mr-3" />
                  {createBookingMutation.isPending ? "Creating Booking..." : "Create Booking"}
                </Button>
              </div>
            </div>
          )}
          
          {cart.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">Ready to Create Booking</p>
              <p className="text-sm">Add items to cart and select a customer to continue</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
