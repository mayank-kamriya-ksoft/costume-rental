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
        return "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg";
      case "rented":
        return "bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg";
      case "cleaning":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg";
      case "damaged":
        return "bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-lg";
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
      className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group border border-orange-100"
      onClick={handleCardClick}
      data-testid={`card-${type}-${item.id}`}
    >
      <div className="relative">
        <div className="w-full h-64 bg-gradient-to-br from-orange-200 via-purple-200 to-yellow-200 flex items-center justify-center">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-muted-foreground text-center">
              <Info className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">No image available</p>
            </div>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <Badge className={`text-xs font-bold ${getStatusColor(item.status)} border-0`}>
            {item.status === 'available' ? '✅' : 
             item.status === 'rented' ? '📅' : 
             item.status === 'cleaning' ? '🧽' : '⚠️'} {getStatusText(item.status)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/80 hover:bg-white p-2"
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            data-testid={`button-like-${item.id}`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current text-red-500" : ""}`} />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2" data-testid={`text-name-${item.id}`}>
          {item.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2" data-testid={`text-description-${item.id}`}>
          {item.description || "No description available"}
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent" data-testid={`text-price-${item.id}`}>
            ₹{parseFloat(item.pricePerDay).toFixed(0)}/day
          </span>
          {sizes.length > 0 && (
            <span className="text-sm text-muted-foreground">
              Sizes: {sizes.join(", ")}
            </span>
          )}
        </div>
        
        <Dialog open={showRentalForm} onOpenChange={setShowRentalForm}>
          <DialogTrigger asChild>
            <Button
              className={`w-full font-semibold transition-all ${
                isAvailable 
                  ? 'bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl' 
                  : 'bg-gray-400 text-gray-700'
              }`}
              disabled={!isAvailable}
              data-testid={`button-rent-${item.id}`}
            >
              {isAvailable ? "🎭 Rent Now" : "Currently Unavailable"}
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
