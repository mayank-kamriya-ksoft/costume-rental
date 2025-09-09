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
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { Textarea } from "../../components/ui/textarea";

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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              data-testid="input-item-name"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
              <SelectTrigger data-testid="select-item-category">
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

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            data-testid="textarea-item-description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pricePerDay">Price per Day ($)</Label>
            <Input
              id="pricePerDay"
              type="number"
              step="0.01"
              value={formData.pricePerDay}
              onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
              required
              data-testid="input-item-price"
            />
          </div>
          <div>
            <Label htmlFor="securityDeposit">Security Deposit ($)</Label>
            <Input
              id="securityDeposit"
              type="number"
              step="0.01"
              value={formData.securityDeposit}
              onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
              required
              data-testid="input-item-deposit"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sizes">Sizes (comma-separated)</Label>
            <Input
              id="sizes"
              value={formData.sizes}
              onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
              placeholder="S, M, L, XL"
              data-testid="input-item-sizes"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger data-testid="select-item-status">
                <SelectValue />
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

        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://example.com/image.jpg"
            data-testid="input-item-image"
          />
        </div>

        {type === "costume" && (
          <div>
            <Label htmlFor="themes">Themes (comma-separated)</Label>
            <Input
              id="themes"
              value={formData.themes}
              onChange={(e) => setFormData({ ...formData, themes: e.target.value })}
              placeholder="Traditional, Modern, Festival"
              data-testid="input-costume-themes"
            />
          </div>
        )}

        {type === "accessory" && (
          <div>
            <Label htmlFor="linkedCharacters">Linked Characters (comma-separated)</Label>
            <Input
              id="linkedCharacters"
              value={formData.linkedCharacters}
              onChange={(e) => setFormData({ ...formData, linkedCharacters: e.target.value })}
              placeholder="Krishna, Ganesha, Durga"
              data-testid="input-accessory-characters"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => item ? setEditingItem(null) : setIsAddDialogOpen(false)}
            disabled={isLoading}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} data-testid="button-save-item">
            {isLoading ? "Saving..." : (item ? "Update" : "Add")} {type === "costume" ? "Costume" : "Accessory"}
          </Button>
        </div>
      </form>
    );
  };

  const ItemsTable = ({ items, type, isLoading }: { 
    items: InventoryItem[]; 
    type: string; 
    isLoading: boolean;
  }) => {
    if (isLoading) {
      return <div className="text-center py-8">Loading {type}s...</div>;
    }

    const filteredItems = getFilteredItems(items);

    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No {type}s found{searchTerm || statusFilter !== "all" ? " matching your filters" : ""}
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price/Day</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sizes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div>
                  <div className="font-medium" data-testid={`text-item-${item.id}-name`}>{item.name}</div>
                  {item.description && (
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {(categories as Category[] || []).find((cat: Category) => cat.id === item.categoryId)?.name || "Unknown"}
              </TableCell>
              <TableCell>${item.pricePerDay}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(item.status)} data-testid={`status-${item.id}`}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                {item.sizes?.length > 0 ? item.sizes.join(", ") : "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingItem(item)}
                    data-testid={`button-edit-${item.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                        deleteItemMutation.mutate({ type, id: item.id });
                      }
                    }}
                    data-testid={`button-delete-${item.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage costumes and accessories</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-item">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New {activeTab === "costumes" ? "Costume" : "Accessory"}</DialogTitle>
              <DialogDescription>
                Add a new {activeTab === "costumes" ? "costume" : "accessory"} to your inventory
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

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-search"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40" data-testid="select-status-filter">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="damaged">Damaged</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="costumes" data-testid="tab-costumes">Costumes</TabsTrigger>
          <TabsTrigger value="accessories" data-testid="tab-accessories">Accessories</TabsTrigger>
        </TabsList>

        <TabsContent value="costumes">
          <Card>
            <CardHeader>
              <CardTitle>Costumes</CardTitle>
              <CardDescription>Manage your costume inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <ItemsTable 
                items={(costumes as InventoryItem[]) || []} 
                type="costume" 
                isLoading={costumesLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessories">
          <Card>
            <CardHeader>
              <CardTitle>Accessories</CardTitle>
              <CardDescription>Manage your accessory inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <ItemsTable 
                items={(accessories as InventoryItem[]) || []} 
                type="accessory" 
                isLoading={accessoriesLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Item Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit {editingItem.themes ? "Costume" : "Accessory"}</DialogTitle>
              <DialogDescription>
                Update the details for {editingItem.name}
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