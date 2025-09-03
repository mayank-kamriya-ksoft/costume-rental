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
      className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
      onClick={handleCardClick}
      data-testid={`card-${type}-${item.id}`}
    >
      <div className="relative">
        <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center">
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
          <Badge className={`text-xs font-medium ${getStatusColor(item.status)}`}>
            {getStatusText(item.status)}
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
          <span className="text-lg font-bold text-primary" data-testid={`text-price-${item.id}`}>
            ${parseFloat(item.pricePerDay).toFixed(0)}/day
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
              className="w-full"
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
