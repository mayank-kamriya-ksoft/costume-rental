import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import { ArrowLeft, Package, Sparkles, Tags, Image, DollarSign, Save } from "lucide-react";
import { Textarea } from "../../components/ui/textarea";
import { cn } from "../../lib/utils";
import { useLocation } from "wouter";

type Category = {
  id: string;
  name: string;
  description: string;
  type: string;
};

export default function AddItemPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    pricePerDay: "",
    securityDeposit: "",
    sizes: "",
    status: "available",
    imageUrl: "",
    themes: "",
    linkedCharacters: "",
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Determine item type based on selected category
  const selectedCategory = categories?.find(cat => cat.id === formData.categoryId);
  const itemType = selectedCategory?.type || "";

  const createItemMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = itemType === "costume" ? "/api/costumes" : "/api/accessories";
      const response = await apiRequest("POST", endpoint, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ 
        title: "Success", 
        description: `${itemType === "costume" ? "Costume" : "Accessory"} added successfully!` 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/costumes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/accessories"] });
      setLocation("/admin");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    const data = {
      ...formData,
      pricePerDay: parseFloat(formData.pricePerDay),
      securityDeposit: parseFloat(formData.securityDeposit),
      sizes: formData.sizes.split(",").map(s => s.trim()).filter(s => s),
      ...(itemType === "costume" && {
        themes: formData.themes.split(",").map(t => t.trim()).filter(t => t)
      }),
      ...(itemType === "accessory" && {
        linkedCharacters: formData.linkedCharacters.split(",").map(c => c.trim()).filter(c => c)
      }),
    };
    
    createItemMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/admin")}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Add New Item
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                {selectedCategory 
                  ? `Creating a new ${itemType} in ${selectedCategory.name}` 
                  : "Add a new costume or accessory to your inventory"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-700">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Item Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Basic Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Item Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter item name"
                      className="h-12 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 text-base"
                      required
                      data-testid="input-item-name"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="category" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Category *
                    </Label>
                    <Select 
                      value={formData.categoryId} 
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                      disabled={categoriesLoading}
                    >
                      <SelectTrigger className="h-12 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-base" data-testid="select-item-category">
                        <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select category"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center space-x-2">
                              {category.type === "costume" ? (
                                <Package className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Sparkles className="h-4 w-4 text-green-500" />
                              )}
                              <span>{category.name}</span>
                              <span className="text-xs text-slate-500 ml-2">({category.type})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter detailed description of the item"
                    className="min-h-[120px] border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 resize-none text-base"
                    data-testid="textarea-item-description"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                {/* Pricing Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Pricing & Availability</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="pricePerDay" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Price per Day ($) *
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          id="pricePerDay"
                          type="number"
                          step="0.01"
                          value={formData.pricePerDay}
                          onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                          placeholder="0.00"
                          className="pl-12 h-12 border-slate-200 dark:border-slate-700 focus:border-green-500 focus:ring-green-500/20 text-base"
                          required
                          data-testid="input-item-price"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="securityDeposit" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Security Deposit ($) *
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          id="securityDeposit"
                          type="number"
                          step="0.01"
                          value={formData.securityDeposit}
                          onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                          placeholder="0.00"
                          className="pl-12 h-12 border-slate-200 dark:border-slate-700 focus:border-green-500 focus:ring-green-500/20 text-base"
                          required
                          data-testid="input-item-deposit"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="sizes" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Available Sizes
                      </Label>
                      <Input
                        id="sizes"
                        value={formData.sizes}
                        onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                        placeholder="S, M, L, XL"
                        className="h-12 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 text-base"
                        data-testid="input-item-sizes"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Status *
                      </Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger className="h-12 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-base" data-testid="select-item-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span>Available</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="rented">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span>Rented</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="cleaning">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <span>Cleaning</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="damaged">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span>Damaged</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                {/* Media & Details Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Image className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Additional Details</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="imageUrl" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Image URL
                    </Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="h-12 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20 text-base"
                      data-testid="input-item-image"
                    />
                  </div>

                  {itemType === "costume" && (
                    <div className="space-y-3">
                      <Label htmlFor="themes" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        <div className="flex items-center space-x-2">
                          <Tags className="h-4 w-4" />
                          <span>Themes</span>
                        </div>
                      </Label>
                      <Input
                        id="themes"
                        value={formData.themes}
                        onChange={(e) => setFormData({ ...formData, themes: e.target.value })}
                        placeholder="Traditional, Modern, Festival"
                        className="h-12 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20 text-base"
                        data-testid="input-costume-themes"
                      />
                    </div>
                  )}

                  {itemType === "accessory" && (
                    <div className="space-y-3">
                      <Label htmlFor="linkedCharacters" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="h-4 w-4" />
                          <span>Linked Characters</span>
                        </div>
                      </Label>
                      <Input
                        id="linkedCharacters"
                        value={formData.linkedCharacters}
                        onChange={(e) => setFormData({ ...formData, linkedCharacters: e.target.value })}
                        placeholder="Krishna, Ganesha, Durga"
                        className="h-12 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20 text-base"
                        data-testid="input-accessory-characters"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setLocation("/admin")}
                    disabled={createItemMutation.isPending}
                    className="px-8 h-12 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-base"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createItemMutation.isPending || !formData.categoryId} 
                    className="px-8 h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-base font-medium"
                    data-testid="button-save-item"
                  >
                    {createItemMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="h-5 w-5" />
                        <span>Create {itemType ? itemType.charAt(0).toUpperCase() + itemType.slice(1) : "Item"}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}