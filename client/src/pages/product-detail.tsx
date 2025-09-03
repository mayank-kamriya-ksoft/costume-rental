import { useState, useEffect } from "react";
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
import { ArrowLeft, Heart, Shield, Clock, Package, Info, Star, ZoomIn, CheckCircle, Truck, RotateCcw } from "lucide-react";
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
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { data: product, isLoading } = useQuery<Costume | Accessory>({
    queryKey: [`/api/${productType}s/${productId}`],
    enabled: !!productId,
  });

  const { data: relatedProducts } = useQuery<(Costume | Accessory)[]>({
    queryKey: [`/api/${productType}s`],
    enabled: !!product,
    select: (data) => data?.filter(item => 
      item.id !== product?.id && 
      item.categoryId === product?.categoryId
    ).slice(0, 4)
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Enhanced Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-card rounded-2xl overflow-hidden shadow-2xl group">
              <div className="aspect-square bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 flex items-center justify-center relative">
                {productImages[currentImageIndex] && productImages[currentImageIndex] !== "/placeholder-costume.jpg" ? (
                  <div className="relative w-full h-full">
                    <img
                      src={productImages[currentImageIndex].startsWith('@assets') ? 
                        productImages[currentImageIndex].replace('@assets', '/attached_assets') : 
                        productImages[currentImageIndex]
                      }
                      alt={product.name}
                      className={`w-full h-full object-cover transition-all duration-700 transform ${
                        imageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                      } group-hover:scale-105`}
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        console.log('Product detail image load error:', productImages[currentImageIndex]);
                      }}
                    />
                    {/* Zoom overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white dark:bg-black/90 dark:hover:bg-black"
                        onClick={() => setShowImageZoom(true)}
                        data-testid="button-zoom"
                      >
                        <ZoomIn className="h-4 w-4 mr-2" />
                        View Full Size
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center p-8">
                    <div className="bg-primary/10 rounded-full p-8 mx-auto mb-4 w-fit">
                      <Info className="h-16 w-16 text-primary" />
                    </div>
                    <p className="text-lg font-medium mb-2">{product.name}</p>
                    <p className="text-sm opacity-70">No image available</p>
                  </div>
                )}
              </div>
              
              {/* Status Badge with animation */}
              <div className="absolute top-6 left-6">
                <Badge className={`${getStatusColor(product.status)} shadow-lg animate-pulse`}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {getStatusText(product.status)}
                </Badge>
              </div>
              
              {/* Wishlist button */}
              <div className="absolute top-6 right-6 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-black/90 dark:hover:bg-black p-2 shadow-lg transition-all duration-300 hover:scale-110"
                  onClick={() => setLiked(!liked)}
                  data-testid="button-like"
                >
                  <Heart className={`h-4 w-4 transition-colors duration-300 ${
                    liked ? "fill-current text-red-500" : "text-muted-foreground"
                  }`} />
                </Button>
              </div>
              
              {/* Price badge */}
              <div className="absolute bottom-6 left-6">
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                  ₹{parseFloat(product.pricePerDay).toFixed(0)}/day
                </div>
              </div>
            </div>

            {/* Thumbnail Images (if multiple) */}
            {productImages.length > 1 && (
              <div className="flex gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
                      currentImageIndex === index 
                        ? "border-primary shadow-lg shadow-primary/25" 
                        : "border-muted hover:border-primary/50"
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
            
            {/* Image Zoom Dialog */}
            <Dialog open={showImageZoom} onOpenChange={setShowImageZoom}>
              <DialogContent className="max-w-4xl w-full p-0">
                <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                  {productImages[currentImageIndex] && productImages[currentImageIndex] !== "/placeholder-costume.jpg" && (
                    <img
                      src={productImages[currentImageIndex].startsWith('@assets') ? 
                        productImages[currentImageIndex].replace('@assets', '/attached_assets') : 
                        productImages[currentImageIndex]
                      }
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4"
                    onClick={() => setShowImageZoom(false)}
                  >
                    ×
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Enhanced Product Details */}
          <div className="space-y-8">
            {/* Title and Description */}
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight" data-testid="text-product-name">
                  {product.name}
                </h1>
                <p className="text-muted-foreground text-xl leading-relaxed" data-testid="text-product-description">
                  {product.description || "No description available"}
                </p>
              </div>
              
              {/* Enhanced Pricing Section */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-primary" data-testid="text-price">
                      ₹{parseFloat(product.pricePerDay).toFixed(0)}
                    </span>
                    <span className="text-lg text-muted-foreground font-medium">/day</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Starting from</p>
                  </div>
                </div>
                {securityDeposit > 0 && (
                  <div className="flex items-center justify-between pt-3 border-t border-primary/20">
                    <span className="text-sm text-muted-foreground">Security deposit:</span>
                    <span className="font-semibold text-foreground">₹{securityDeposit.toFixed(0)}</span>
                  </div>
                )}
              </div>
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

            {/* Enhanced Size Selection */}
            {sizes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Select Size</h3>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full h-14 text-lg border-2 hover:border-primary transition-colors" data-testid="select-size">
                    <SelectValue placeholder="Choose your perfect size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((size) => (
                      <SelectItem key={size} value={size} data-testid={`option-size-${size}`} className="text-lg py-3">
                        Size {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedSize && (
                  <div className="flex items-center text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Size {selectedSize} selected
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="space-y-4">
              <Dialog open={showRentalForm} onOpenChange={setShowRentalForm}>
                <DialogTrigger asChild>
                  <Button
                    className={`w-full text-xl py-8 rounded-2xl font-bold shadow-xl transition-all duration-300 transform hover:scale-105 ${
                      !isAvailable 
                        ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed" 
                        : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-primary/25"
                    }`}
                    disabled={!isAvailable || (sizes.length > 0 && !selectedSize)}
                    data-testid="button-rent-now"
                  >
                    {!isAvailable 
                      ? (
                        <>
                          <Package className="h-5 w-5 mr-3" />
                          Currently Unavailable
                        </>
                      )
                      : sizes.length > 0 && !selectedSize
                      ? (
                        <>
                          <Info className="h-5 w-5 mr-3" />
                          Select Size to Continue
                        </>
                      )
                      : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-3" />
                          Rent Now - ₹{parseFloat(product.pricePerDay).toFixed(0)}/day
                        </>
                      )}
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
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="py-4 text-base border-2 hover:bg-primary/5 hover:border-primary transition-all duration-300"
                  onClick={() => setLiked(!liked)}
                >
                  <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current text-red-500" : ""}`} />
                  {liked ? "Saved" : "Save"}
                </Button>
                <Button 
                  variant="outline" 
                  className="py-4 text-base border-2 hover:bg-primary/5 hover:border-primary transition-all duration-300"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Details
                </Button>
              </div>
            </div>

            {/* Enhanced Product Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20 hover:border-primary/40">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <Shield className="h-7 w-7 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground mb-1">Quality Assured</p>
                  <p className="text-sm text-muted-foreground">Professional cleaning & maintenance</p>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20 hover:border-primary/40">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <Clock className="h-7 w-7 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground mb-1">Flexible Rental</p>
                  <p className="text-sm text-muted-foreground">Daily pricing, extend as needed</p>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20 hover:border-primary/40">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <Truck className="h-7 w-7 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground mb-1">Easy Delivery</p>
                  <p className="text-sm text-muted-foreground">Doorstep pickup & return</p>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20 hover:border-primary/40">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <Star className="h-7 w-7 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground mb-1">Premium Quality</p>
                  <p className="text-sm text-muted-foreground">Authentic designs & materials</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Enhanced Product Information Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-foreground text-center">Complete Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-primary/20 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Rental Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                    <span className="text-muted-foreground font-medium">Daily Rate:</span>
                    <span className="font-bold text-lg text-primary">₹{parseFloat(product.pricePerDay).toFixed(0)}</span>
                  </div>
                  {securityDeposit > 0 && (
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span className="text-muted-foreground font-medium">Security Deposit:</span>
                      <span className="font-semibold">₹{securityDeposit.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground font-medium">Status:</span>
                    <Badge className={`${getStatusColor(product.status)} text-sm px-3 py-1`}>
                      {getStatusText(product.status)}
                    </Badge>
                  </div>
                  {sizes.length > 0 && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <span className="text-muted-foreground font-medium block mb-2">Available Sizes:</span>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map(size => (
                          <Badge key={size} variant="outline" className="px-3 py-1">
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <RotateCcw className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Rental Terms</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Minimum rental period: 1 day</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Late return charges may apply</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Damage assessment on return</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Professional cleaning included</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Security deposit refunded after return</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Related Products Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <>
            <Separator className="my-12" />
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-2">You Might Also Like</h2>
                <p className="text-muted-foreground text-lg">Similar {productType}s from the same collection</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((item) => {
                  const itemImageUrl = item.imageUrl?.startsWith('@assets') ? 
                    item.imageUrl.replace('@assets', '/attached_assets') : 
                    item.imageUrl;
                  
                  return (
                    <Card key={item.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-primary/10 hover:border-primary/30">
                      <CardContent className="p-0">
                        <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-secondary/20 rounded-t-lg overflow-hidden">
                          {itemImageUrl ? (
                            <img
                              src={itemImageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                              <Info className="h-12 w-12" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                          <div className="absolute bottom-2 right-2">
                            <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm font-bold">
                              ₹{parseFloat(item.pricePerDay).toFixed(0)}/day
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {item.description}
                          </p>
                          <Button 
                            className="w-full" 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/${productType}/${item.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}