import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { useToast } from "../../hooks/use-toast";
import { Plus, Edit, Trash2, Search, Filter, Package, Sparkles, Tags, Image, DollarSign } from "lucide-react";
import { Textarea } from "../../components/ui/textarea";
import { Separator } from "../../components/ui/separator";
import { cn } from "../../lib/utils";

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
  themes?: string[];
  linkedCharacters?: string[];
  createdAt: string;
  updatedAt: string;
};

type Category = {
  id: string;
  name: string;
  description: string;
  type: string;
};

export default function InventoryManagement() {
  const [activeTab, setActiveTab] = useState("costumes");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: costumes, isLoading: costumesLoading } = useQuery({
    queryKey: ["/api/costumes"],
  });

  const { data: accessories, isLoading: accessoriesLoading } = useQuery({
    queryKey: ["/api/accessories"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Mutations
  const createItemMutation = useMutation({
    mutationFn: async (data: { type: string; item: any }) => {
      const endpoint = data.type === "costume" ? "/api/costumes" : "/api/accessories";
      const response = await apiRequest("POST", endpoint, data.item);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Item added successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/costumes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/accessories"] });
      setIsAddDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async (data: { type: string; id: string; item: any }) => {
      const endpoint = data.type === "costume" ? `/api/costumes/${data.id}` : `/api/accessories/${data.id}`;
      const response = await apiRequest("PUT", endpoint, data.item);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Item updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/costumes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/accessories"] });
      setEditingItem(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (data: { type: string; id: string }) => {
      const endpoint = data.type === "costume" ? `/api/costumes/${data.id}` : `/api/accessories/${data.id}`;
      await apiRequest("DELETE", endpoint);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Item deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/costumes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/accessories"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const getFilteredItems = (items: InventoryItem[] | undefined) => {
    return (items || []).filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "rented":
        return "secondary";
      case "cleaning":
        return "outline";
      case "damaged":
        return "destructive";
      default:
        return "outline";
    }
  };

  const ItemForm = ({ item, type, onSubmit, isLoading }: {
    item?: InventoryItem | null;
    type: string;
    onSubmit: (data: any) => void;
    isLoading: boolean;
  }) => {
    const [formData, setFormData] = useState({
      name: item?.name || "",
      description: item?.description || "",
      categoryId: item?.categoryId || "",
      pricePerDay: item?.pricePerDay || "",
      securityDeposit: item?.securityDeposit || "",
      sizes: item?.sizes?.join(", ") || "",
      status: item?.status || "available",
      imageUrl: item?.imageUrl || "",
      themes: type === "costume" ? item?.themes?.join(", ") || "" : "",
      linkedCharacters: type === "accessory" ? item?.linkedCharacters?.join(", ") || "" : "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const data = {
        ...formData,
        pricePerDay: parseFloat(formData.pricePerDay),
        securityDeposit: parseFloat(formData.securityDeposit),
        sizes: formData.sizes.split(",").map(s => s.trim()).filter(s => s),
        ...(type === "costume" && {
          themes: formData.themes.split(",").map(t => t.trim()).filter(t => t)
        }),
        ...(type === "accessory" && {
          linkedCharacters: formData.linkedCharacters.split(",").map(c => c.trim()).filter(c => c)
        }),
      };
      onSubmit(data);
    };

    const typeCategories = (categories as Category[] || []).filter((cat: Category) => cat.type === type);

    return (
      <div className="max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-8 p-1">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Item Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter item name"
                  className="h-11 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                  data-testid="input-item-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Category *
                </Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger className="h-11 border-slate-200 dark:border-slate-700 focus:border-blue-500" data-testid="select-item-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter detailed description of the item"
                className="min-h-[100px] border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                data-testid="textarea-item-description"
              />
            </div>
          </div>

          <Separator className="my-6" />

          {/* Pricing Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Pricing & Status</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="pricePerDay" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Price per Day ($) *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="pricePerDay"
                    type="number"
                    step="0.01"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                    placeholder="0.00"
                    className="pl-10 h-11 border-slate-200 dark:border-slate-700 focus:border-green-500 focus:ring-green-500/20"
                    required
                    data-testid="input-item-price"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="securityDeposit" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Security Deposit ($) *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="securityDeposit"
                    type="number"
                    step="0.01"
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                    placeholder="0.00"
                    className="pl-10 h-11 border-slate-200 dark:border-slate-700 focus:border-green-500 focus:ring-green-500/20"
                    required
                    data-testid="input-item-deposit"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sizes" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Available Sizes
                </Label>
                <Input
                  id="sizes"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  placeholder="S, M, L, XL"
                  className="h-11 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                  data-testid="input-item-sizes"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Status *
                </Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="h-11 border-slate-200 dark:border-slate-700 focus:border-blue-500" data-testid="select-item-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Available</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="rented">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Rented</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="cleaning">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Cleaning</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="damaged">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Damaged</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Media & Details Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Image className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Media & Additional Details</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="h-11 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20"
                data-testid="input-item-image"
              />
            </div>

            {type === "costume" && (
              <div className="space-y-2">
                <Label htmlFor="themes" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center space-x-1">
                    <Tags className="h-4 w-4" />
                    <span>Themes</span>
                  </div>
                </Label>
                <Input
                  id="themes"
                  value={formData.themes}
                  onChange={(e) => setFormData({ ...formData, themes: e.target.value })}
                  placeholder="Traditional, Modern, Festival"
                  className="h-11 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20"
                  data-testid="input-costume-themes"
                />
              </div>
            )}

            {type === "accessory" && (
              <div className="space-y-2">
                <Label htmlFor="linkedCharacters" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-4 w-4" />
                    <span>Linked Characters</span>
                  </div>
                </Label>
                <Input
                  id="linkedCharacters"
                  value={formData.linkedCharacters}
                  onChange={(e) => setFormData({ ...formData, linkedCharacters: e.target.value })}
                  placeholder="Krishna, Ganesha, Durga"
                  className="h-11 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20"
                  data-testid="input-accessory-characters"
                />
              </div>
            )}
          </div>

          <Separator className="my-8" />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => item ? setEditingItem(null) : setIsAddDialogOpen(false)}
              disabled={isLoading}
              className="px-6 h-11 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className={cn(
                "px-6 h-11 bg-gradient-to-r text-white shadow-md hover:shadow-lg transition-all duration-200",
                type === "costume" 
                  ? "from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" 
                  : "from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              )}
              data-testid="button-save-item"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                `${item ? "Update" : "Add"} ${type === "costume" ? "Costume" : "Accessory"}`
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  };

  const ItemsTable = ({ items, type, isLoading }: { 
    items: InventoryItem[]; 
    type: string; 
    isLoading: boolean;
  }) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    const filteredItems = getFilteredItems(items);

    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <Package className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            No {type}s found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filter criteria" 
              : `Start by adding your first ${type} to the inventory`}
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-200 dark:border-slate-700">
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300 h-12">Item Details</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300 h-12">Category</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300 h-12">Pricing</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300 h-12">Status</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300 h-12">Sizes</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300 h-12 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item, index) => (
              <TableRow 
                key={item.id} 
                className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-150 border-slate-200 dark:border-slate-700"
              >
                <TableCell className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-md",
                      type === "costume" 
                        ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                        : "bg-gradient-to-r from-green-500 to-emerald-500"
                    )}>
                      {type === "costume" ? <Package className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100" data-testid={`text-item-${item.id}-name`}>
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                          {item.description.length > 60 ? `${item.description.substring(0, 60)}...` : item.description}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-slate-700 dark:text-slate-300 font-medium">
                    {(categories as Category[] || []).find((cat: Category) => cat.id === item.categoryId)?.name || "Unknown"}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-col space-y-1">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      ${item.pricePerDay}/day
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      ${item.securityDeposit} deposit
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge 
                    variant={getStatusColor(item.status)} 
                    className={cn(
                      "px-3 py-1 text-xs font-medium",
                      item.status === "available" && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                      item.status === "rented" && "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
                      item.status === "cleaning" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
                      item.status === "damaged" && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    )}
                    data-testid={`status-${item.id}`}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full mr-2",
                      item.status === "available" && "bg-green-500",
                      item.status === "rented" && "bg-blue-500",
                      item.status === "cleaning" && "bg-yellow-500",
                      item.status === "damaged" && "bg-red-500"
                    )}></div>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-slate-700 dark:text-slate-300">
                    {item.sizes?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {item.sizes.slice(0, 3).map((size, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs rounded-md">
                            {size}
                          </span>
                        ))}
                        {item.sizes.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs rounded-md">
                            +{item.sizes.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingItem(item)}
                      className="h-8 w-8 p-0 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700"
                      data-testid={`button-edit-${item.id}`}
                    >
                      <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                          deleteItemMutation.mutate({ type, id: item.id });
                        }
                      }}
                      className="h-8 w-8 p-0 border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700"
                      data-testid={`button-delete-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Inventory Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage your costume and accessory collections</p>
            </div>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-11 px-6"
              data-testid="button-add-item"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <span>Add New {activeTab === "costumes" ? "Costume" : "Accessory"}</span>
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Create a new {activeTab === "costumes" ? "costume" : "accessory"} entry in your inventory system
              </DialogDescription>
            </DialogHeader>
            <ItemForm
              type={activeTab === "costumes" ? "costume" : "accessory"}
              onSubmit={(data) => createItemMutation.mutate({ 
                type: activeTab === "costumes" ? "costume" : "accessory", 
                item: data 
              })}
              isLoading={createItemMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Search and Filter */}
      <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search by name, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                  data-testid="input-search"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 h-12 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900" data-testid="select-status-filter">
                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>All Status</span>
                  </div>
                </SelectItem>
                <SelectItem value="available">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Available</span>
                  </div>
                </SelectItem>
                <SelectItem value="rented">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Rented</span>
                  </div>
                </SelectItem>
                <SelectItem value="cleaning">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Cleaning</span>
                  </div>
                </SelectItem>
                <SelectItem value="damaged">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Damaged</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <TabsTrigger 
            value="costumes" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg font-medium transition-all duration-200" 
            data-testid="tab-costumes"
          >
            <Package className="h-4 w-4 mr-2" />
            Costumes
          </TabsTrigger>
          <TabsTrigger 
            value="accessories" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg font-medium transition-all duration-200" 
            data-testid="tab-accessories"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Accessories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="costumes">
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Costumes</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">Manage your complete costume collection</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ItemsTable 
                items={(costumes as InventoryItem[]) || []} 
                type="costume" 
                isLoading={costumesLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessories">
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Accessories</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">Manage your accessory inventory and props</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ItemsTable 
                items={(accessories as InventoryItem[]) || []} 
                type="accessory" 
                isLoading={accessoriesLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Edit Item Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                  <Edit className="h-5 w-5 text-white" />
                </div>
                <span>Edit {editingItem.themes ? "Costume" : "Accessory"}</span>
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Update the details for <span className="font-medium text-slate-800 dark:text-slate-200">{editingItem.name}</span>
              </DialogDescription>
            </DialogHeader>
            <ItemForm
              item={editingItem}
              type={editingItem.themes ? "costume" : "accessory"}
              onSubmit={(data) => updateItemMutation.mutate({ 
                type: editingItem.themes ? "costume" : "accessory", 
                id: editingItem.id,
                item: data 
              })}
              isLoading={updateItemMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}