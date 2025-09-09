import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RentalForm from "./rental-form";
import { Heart, Info } from "lucide-react";
import type { Costume, Accessory } from "@shared/schema";

interface ProductCardProps {
  item: Costume | Accessory;
  type: "costume" | "accessory";
}

export default function ProductCard({ item, type }: ProductCardProps) {
  const [, navigate] = useLocation();
  const [liked, setLiked] = useState(false);
  const [showRentalForm, setShowRentalForm] = useState(false);

  const handleCardClick = () => {
    navigate(`/${type}/${item.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500 text-white shadow-sm border-0";
      case "rented":
        return "bg-orange-500 text-white shadow-sm border-0";
      case "cleaning":
        return "bg-yellow-500 text-white shadow-sm border-0";
      case "damaged":
        return "bg-red-500 text-white shadow-sm border-0";
      default:
        return "bg-gray-500 text-white shadow-sm border-0";
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

  const isAvailable = item.status === "available";
  const sizes = Array.isArray(item.sizes) ? item.sizes : [];

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group border border-border"
      onClick={handleCardClick}
      data-testid={`card-${type}-${item.id}`}
    >
      <div className="relative">
        <div className="w-full h-64 bg-gradient-to-br from-secondary via-muted to-accent flex items-center justify-center">
          {item.imageUrl ? (
            <img
              src={item.imageUrl.startsWith('@assets') ? 
                item.imageUrl.replace('@assets', '/attached_assets') : 
                item.imageUrl
              }
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                console.log('Image load error:', item.imageUrl);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="text-muted-foreground text-center">
              <Info className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">No image available</p>
            </div>
          )}
        </div>
        <div className="absolute top-4 left-4">
          <Badge className={`text-xs font-semibold ${getStatusColor(item.status)} px-3 py-1`}>
            {getStatusText(item.status)}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md border-0"
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            data-testid={`button-like-${item.id}`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current text-red-500" : "text-muted-foreground"}`} />
          </Button>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-foreground mb-3 text-lg leading-tight" data-testid={`text-name-${item.id}`}>
          {item.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed" data-testid={`text-description-${item.id}`}>
          {item.description || "No description available"}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-primary" data-testid={`text-price-${item.id}`}>
              ₹{parseFloat(item.pricePerDay).toFixed(0)}
            </span>
            <span className="text-sm text-muted-foreground ml-1">per day</span>
          </div>
          {sizes.length > 0 && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Available Sizes</p>
              <p className="text-sm font-medium text-foreground">
                {sizes.join(", ")}
              </p>
            </div>
          )}
        </div>
        
        <Dialog open={showRentalForm} onOpenChange={setShowRentalForm}>
          <DialogTrigger asChild>
            <Button
              className={`w-full font-semibold transition-all h-12 rounded-xl ${
                isAvailable 
                  ? 'professional-gradient text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!isAvailable}
              data-testid={`button-rent-${item.id}`}
            >
              {isAvailable ? "Rent Now" : "Currently Unavailable"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Rent {item.name}</DialogTitle>
            </DialogHeader>
            <RentalForm
              item={item}
              type={type}
              onSuccess={() => setShowRentalForm(false)}
              onCancel={() => setShowRentalForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
