import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { 
  Search, 
  Users, 
  Edit, 
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Filter,
  UserCheck,
  UserX,
  Plus,
  ChevronDown
} from "lucide-react";
import { apiRequest } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";
import { format } from "date-fns";

type Customer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  dateOfBirth?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

type CustomerFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isActive: boolean;
  password?: string;
};

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
const [expandedCustomerId, setExpandedCustomerId] = useState(null);

const toggleCustomerDetails = (customerId) => {
  setExpandedCustomerId(expandedCustomerId === customerId ? null : customerId);
};
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    isActive: true,
    password: "",
  });

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append('search', searchTerm);
  if (statusFilter !== 'all') queryParams.append('isActive', statusFilter);

  // Fetch customers
  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/admin/customers", searchTerm, statusFilter],
    queryFn: async () => {
      const url = `/api/admin/customers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    },
  });

  // Create customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: async (data: CustomerFormData & { password: string }) => {
      const response = await apiRequest("POST", "/api/admin/customers", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Customer created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/customers"] });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CustomerFormData> }) => {
      const response = await apiRequest("PUT", `/api/admin/customers/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Customer updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/customers"] });
      setIsEditDialogOpen(false);
      setEditingCustomer(null);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      isActive: true,
      password: "",
    });
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone || "",
      address: customer.address || "",
      city: customer.city || "",
      postalCode: customer.postalCode || "",
      isActive: customer.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      const { password, ...updateData } = formData;
      updateCustomerMutation.mutate({ id: editingCustomer.id, data: updateData });
    } else {
      // Creating new customer - password is required
      if (!formData.password || formData.password.length < 8) {
        toast({ 
          title: "Error", 
          description: "Password must be at least 8 characters long", 
          variant: "destructive" 
        });
        return;
      }
      createCustomerMutation.mutate(formData as CustomerFormData & { password: string });
    }
  };

  const toggleCustomerStatus = async (customer: Customer) => {
    try {
      await updateCustomerMutation.mutateAsync({ 
        id: customer.id, 
        data: { isActive: !customer.isActive } 
      });
    } catch (error) {
      // Error already handled by mutation
    }
  };

  const getStatusBadge = (customer: Customer) => {
    if (!customer.isActive) {
      return <Badge variant="destructive" data-testid={`badge-status-${customer.id}`}>Inactive</Badge>;
    }
    if (!customer.emailVerified) {
      return <Badge variant="secondary" data-testid={`badge-status-${customer.id}`}>Unverified</Badge>;
    }
    return <Badge variant="default" className="bg-green-600" data-testid={`badge-status-${customer.id}`}>Active</Badge>;
  };

  const filteredCustomers = customers || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Customer Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            View and manage customer accounts
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Total: {filteredCustomers.length} customers
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            data-testid="button-add-customer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                data-testid="input-search-customers"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="animate-pulse space-y-4">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                    </div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100" data-testid={`text-customer-name-${customer.id}`}>
                          {customer.firstName} {customer.lastName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(customer)}
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                          {customer.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(customer)}
                      data-testid={`button-edit-customer-${customer.id}`}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" data-testid={`button-menu-customer-${customer.id}`}>
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => toggleCustomerStatus(customer)}
                          data-testid={`button-toggle-status-${customer.id}`}
                        >
                          {customer.isActive ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  
                  {/* Dropdown arrow for expanding/collapsing details */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCustomerDetails(customer.id)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedCustomerId === customer.id ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </div>
              
              {/* Collapsible details section */}
              {expandedCustomerId === customer.id && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400" data-testid={`text-customer-email-${customer.id}`}>
                        {customer.email}
                      </span>
                    </div>
                    
                    {customer.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400" data-testid={`text-customer-phone-${customer.id}`}>
                          {customer.phone}
                        </span>
                      </div>
                    )}
                    
                    {(customer.city || customer.address) && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400" data-testid={`text-customer-location-${customer.id}`}>
                          {customer.city ? `${customer.city}${customer.address ? ', ' + customer.address : ''}` : customer.address}
                        </span>
                      </div>
                    )}
                    
                    {customer.dateOfBirth && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400" data-testid={`text-customer-dob-${customer.id}`}>
                          {format(new Date(customer.dateOfBirth), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">
                        Joined {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  data-testid="input-customer-firstname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  data-testid="input-customer-lastname"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                data-testid="input-customer-email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                data-testid="input-customer-phone"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                data-testid="input-customer-address"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  data-testid="input-customer-city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  data-testid="input-customer-postal"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                data-testid="switch-customer-active"
              />
              <Label htmlFor="isActive">Active Account</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingCustomer(null);
                  resetForm();
                }}
                data-testid="button-cancel-edit-customer"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateCustomerMutation.isPending}
                data-testid="button-update-customer"
              >
                {updateCustomerMutation.isPending ? "Updating..." : "Update Customer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Create a new customer account with login credentials
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-firstName">First Name *</Label>
                <Input
                  id="add-firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  data-testid="input-add-customer-firstname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-lastName">Last Name *</Label>
                <Input
                  id="add-lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  data-testid="input-add-customer-lastname"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-email">Email Address *</Label>
              <Input
                id="add-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="input-add-customer-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-password">Password *</Label>
              <Input
                id="add-password"
                type="password"
                required
                minLength={8}
                value={formData.password || ""}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 8 characters"
                data-testid="input-add-customer-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-phone">Phone Number</Label>
              <Input
                id="add-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                data-testid="input-add-customer-phone"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="add-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                data-testid="switch-add-customer-active"
              />
              <Label htmlFor="add-isActive">Active Account</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
                data-testid="button-cancel-add-customer"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createCustomerMutation.isPending}
                data-testid="button-create-customer"
              >
                {createCustomerMutation.isPending ? "Creating..." : "Create Customer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {filteredCustomers.length === 0 && !isLoading && (
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No customers found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm || statusFilter !== 'all' 
                ? "No customers match your current filters." 
                : "No customers have registered yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}