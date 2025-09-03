import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Package, Search } from "lucide-react";
import type { Costume, Accessory, Category } from "@shared/schema";

const itemFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  pricePerDay: z.string().min(1, "Price is required"),
  sizes: z.array(z.string()).optional(),
  themes: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["available", "rented", "cleaning", "damaged"]).default("available"),
});

type ItemFormData = z.infer<typeof itemFormSchema>;

export default function InventoryManagement() {
  const [activeTab, setActiveTab] = useState<"costumes" | "accessories">("costumes");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<(Costume | Accessory) | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: costumes = [], isLoading: costumesLoading } = useQuery<Costume[]>({
    queryKey: ["/api/costumes", filters],
    enabled: activeTab === "costumes",
  });

  const { data: accessories = [], isLoading: accessoriesLoading } = useQuery<Accessory[]>({
    queryKey: ["/api/accessories", filters],
    enabled: activeTab === "accessories",
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      status: "available",
      sizes: [],
      themes: [],
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: ItemFormData) => {
      const endpoint = activeTab === "costumes" ? "/api/costumes" : "/api/accessories";
      const itemData = {
        ...data,
        pricePerDay: parseFloat(data.pricePerDay),
        sizes: data.sizes || [],
        themes: activeTab === "costumes" ? (data.themes || []) : undefined,
      };
      return await apiRequest("POST", endpoint, itemData);
    },
    onSuccess: () => {
      toast({
        title: "Item Created",
        description: `${activeTab === "costumes" ? "Costume" : "Accessory"} created successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/costumes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/accessories"] });
      setShowAddForm(false);
      reset();
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async (data: ItemFormData & { id: string }) => {
      const endpoint = activeTab === "costumes" ? `/api/costumes/${data.id}` : `/api/accessories/${data.id}`;
      const itemData = {
        ...data,
        pricePerDay: parseFloat(data.pricePerDay),
        sizes: data.sizes || [],
        themes: activeTab === "costumes" ? (data.themes || []) : undefined,
      };
      return await apiRequest("PUT", endpoint, itemData);
    },
    onSuccess: () => {
      toast({
        title: "Item Updated",
        description: `${activeTab === "costumes" ? "Costume" : "Accessory"} updated successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/costumes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/accessories"] });
      setEditingItem(null);
      reset();
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const endpoint = activeTab === "costumes" ? `/api/costumes/${id}` : `/api/accessories/${id}`;
      return await apiRequest("DELETE", endpoint);
    },
    onSuccess: () => {
      toast({
        title: "Item Deleted",
        description: `${activeTab === "costumes" ? "Costume" : "Accessory"} deleted successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/costumes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/accessories"] });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ItemFormData) => {
    if (editingItem) {
      updateItemMutation.mutate({ ...data, id: editingItem.id });
    } else {
      createItemMutation.mutate(data);
    }
  };

  const handleEdit = (item: Costume | Accessory) => {
    setEditingItem(item);
    reset({
      name: item.name,
      description: item.description || "",
      categoryId: item.categoryId || "",
      pricePerDay: item.pricePerDay,
      sizes: Array.isArray(item.sizes) ? item.sizes : [],
      themes: "themes" in item && Array.isArray(item.themes) ? item.themes : [],
      imageUrl: item.imageUrl || "",
      status: item.status as any,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItemMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "rented":
        return "bg-orange-100 text-orange-800";
      case "cleaning":
        return "bg-yellow-100 text-yellow-800";
      case "damaged":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const currentItems = activeTab === "costumes" ? costumes : accessories;
  const isLoading = activeTab === "costumes" ? costumesLoading : accessoriesLoading;
  const relevantCategories = categories.filter(c => c.type === activeTab.slice(0, -1));

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
  const availableThemes = ["Historical", "Superheroes", "Fantasy", "Halloween", "Medieval", "Victorian", "Pirate"];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
        <Dialog open={showAddForm || !!editingItem} onOpenChange={(open) => {
          if (!open) {
            setShowAddForm(false);
            setEditingItem(null);
            reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowAddForm(true)} data-testid="button-add-item">
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit" : "Add New"} {activeTab === "costumes" ? "Costume" : "Accessory"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter item name"
                    data-testid="input-name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select onValueChange={(value) => setValue("categoryId", value)}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {relevantCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter item description"
                  data-testid="textarea-description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerDay">Price per Day *</Label>
                  <Input
                    id="pricePerDay"
                    type="number"
                    step="0.01"
                    {...register("pricePerDay")}
                    placeholder="0.00"
                    data-testid="input-price"
                  />
                  {errors.pricePerDay && (
                    <p className="text-sm text-destructive">{errors.pricePerDay.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select onValueChange={(value) => setValue("status", value as any)}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  {...register("imageUrl")}
                  placeholder="https://example.com/image.jpg"
                  data-testid="input-image-url"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    reset();
                  }}
                  className="flex-1"
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createItemMutation.isPending || updateItemMutation.isPending}
                  data-testid="button-save"
                >
                  {createItemMutation.isPending || updateItemMutation.isPending
                    ? "Saving..."
                    : editingItem
                    ? "Update"
                    : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "costumes" ? "default" : "secondary"}
          onClick={() => setActiveTab("costumes")}
          data-testid="tab-costumes"
        >
          Costumes
        </Button>
        <Button
          variant={activeTab === "accessories" ? "default" : "secondary"}
          onClick={() => setActiveTab("accessories")}
          data-testid="tab-accessories"
        >
          Accessories
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search items..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
                data-testid="input-search-items"
              />
            </div>
            <Select
              value={filters.category || "all-categories"}
              onValueChange={(value) => setFilters({ ...filters, category: value === "all-categories" ? "" : value })}
            >
              <SelectTrigger data-testid="filter-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {relevantCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status || "all-status"}
              onValueChange={(value) => setFilters({ ...filters, status: value === "all-status" ? "" : value })}
            >
              <SelectTrigger data-testid="filter-status">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="damaged">Damaged</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setFilters({ search: "", category: "", status: "" })}
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            {activeTab === "costumes" ? "Costumes" : "Accessories"} ({currentItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg animate-pulse">
                  <div className="w-16 h-16 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
              <p className="text-muted-foreground">Add your first {activeTab.slice(0, -1)} to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentItems.map((item: Costume | Accessory) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-lg flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground" data-testid={`text-item-name-${item.id}`}>
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.description || "No description"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                          {item.status}
                        </Badge>
                        <span className="text-sm font-medium text-primary">
                          ${parseFloat(item.pricePerDay).toFixed(0)}/day
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      data-testid={`button-edit-${item.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive"
                      data-testid={`button-delete-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
