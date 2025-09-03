import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/header";
import RentalForm from "@/components/customer/rental-form";
import { ArrowLeft, Heart, Shield, Clock, Package, Info, Star } from "lucide-react";
import type { Costume, Accessory } from "@shared/schema";

export default function ProductDetail() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/costume/:id");
  const [accessoryMatch, accessoryParams] = useRoute("/accessory/:id");
  
  const isAccessory = !match && accessoryMatch;
  const productId = params?.id || accessoryParams?.id;
  const productType = isAccessory ? "accessory" : "costume";
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [liked, setLiked] = useState(false);
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: product, isLoading } = useQuery<Costume | Accessory>({
    queryKey: [`/api/${productType}s/${productId}`],
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Button onClick={() => navigate("/")} data-testid="button-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rented":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "cleaning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "damaged":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "rented":
        return "Rented";
      case "cleaning":
        return "Cleaning";
      case "damaged":
        return "Damaged";
      default:
        return "Unknown";
    }
  };

  const isAvailable = product.status === "available";
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  
  // Mock images for demonstration - in a real app, you'd have multiple product images
  const productImages = product.imageUrl 
    ? [product.imageUrl] 
    : ["/placeholder-costume.jpg"];

  const linkedCharacters = "linkedCharacters" in product && Array.isArray(product.linkedCharacters) 
    ? product.linkedCharacters 
    : [];

  const themes = "themes" in product && Array.isArray(product.themes) 
    ? product.themes 
    : [];

  const securityDeposit = "securityDeposit" in product 
    ? parseFloat(product.securityDeposit as string) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="p-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-muted-foreground">
            Home / {productType === "costume" ? "Costumes" : "Accessories"} / {product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-card rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center">
                {productImages[currentImageIndex] && productImages[currentImageIndex] !== "/placeholder-costume.jpg" ? (
                  <img
                    src={productImages[currentImageIndex].startsWith('@assets') ? 
                      productImages[currentImageIndex].replace('@assets', '/attached_assets') : 
                      productImages[currentImageIndex]
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Product detail image load error:', productImages[currentImageIndex]);
                    }}
                  />
                ) : (
                  <div className="text-muted-foreground text-center">
                    <Info className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">{product.name}</p>
                    <p className="text-sm">No image available</p>
                  </div>
                )}
              </div>
              <div className="absolute top-4 left-4">
                <Badge className={`${getStatusColor(product.status)}`}>
                  {getStatusText(product.status)}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black p-2"
                  onClick={() => setLiked(!liked)}
                  data-testid="button-like"
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-current text-red-500" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Thumbnail Images (if multiple) */}
            {productImages.length > 1 && (
              <div className="flex gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? "border-primary" : "border-muted"
                    }`}
                    data-testid={`button-thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-product-name">
                {product.name}
              </h1>
              <p className="text-muted-foreground text-lg" data-testid="text-product-description">
                {product.description || "No description available"}
              </p>
            </div>

            {/* Price and Security Deposit */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary" data-testid="text-price">
                  ₹{parseFloat(product.pricePerDay).toFixed(0)}
                </span>
                <span className="text-muted-foreground">/day</span>
              </div>
              {securityDeposit > 0 && (
                <p className="text-sm text-muted-foreground">
                  Security deposit: ₹{securityDeposit.toFixed(0)}
                </p>
              )}
            </div>

            {/* Themes (for costumes) */}
            {themes.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-2">Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {themes.map((theme, index) => (
                    <Badge key={index} variant="outline" data-testid={`badge-theme-${index}`}>
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Linked Characters (for accessories) */}
            {linkedCharacters.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-2">Suitable for Characters</h3>
                <div className="flex flex-wrap gap-2">
                  {linkedCharacters.map((character, index) => (
                    <Badge key={index} variant="outline" data-testid={`badge-character-${index}`}>
                      {character}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-2">Select Size</h3>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full" data-testid="select-size">
                    <SelectValue placeholder="Choose a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((size) => (
                      <SelectItem key={size} value={size} data-testid={`option-size-${size}`}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Dialog open={showRentalForm} onOpenChange={setShowRentalForm}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full text-lg py-6"
                    disabled={!isAvailable || (sizes.length > 0 && !selectedSize)}
                    data-testid="button-rent-now"
                  >
                    {!isAvailable 
                      ? "Currently Unavailable" 
                      : sizes.length > 0 && !selectedSize
                      ? "Select Size to Rent"
                      : "Rent Now"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Rent {product.name}</DialogTitle>
                  </DialogHeader>
                  <RentalForm
                    item={product}
                    type={productType}
                    selectedSize={selectedSize}
                    onSuccess={() => setShowRentalForm(false)}
                    onCancel={() => setShowRentalForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Product Information Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Quality Assured</p>
                  <p className="text-xs text-muted-foreground">Professional cleaning</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Flexible Rental</p>
                  <p className="text-xs text-muted-foreground">Daily pricing</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Easy Pickup</p>
                  <p className="text-xs text-muted-foreground">Simple return process</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Premium Quality</p>
                  <p className="text-xs text-muted-foreground">Authentic designs</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Additional Product Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Rental Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily Rate:</span>
                    <span className="font-medium">₹{parseFloat(product.pricePerDay).toFixed(0)}</span>
                  </div>
                  {securityDeposit > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Security Deposit:</span>
                      <span className="font-medium">₹{securityDeposit.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={`text-xs ${getStatusColor(product.status)}`}>
                      {getStatusText(product.status)}
                    </Badge>
                  </div>
                  {sizes.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available Sizes:</span>
                      <span className="font-medium">{sizes.join(", ")}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Rental Terms</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Minimum rental period: 1 day</li>
                  <li>• Late return charges may apply</li>
                  <li>• Damage assessment on return</li>
                  <li>• Professional cleaning included</li>
                  <li>• Security deposit refunded after return</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}