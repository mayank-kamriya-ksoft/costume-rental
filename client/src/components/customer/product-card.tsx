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
      className="bg-gradient-to-br from-white via-amber-50/30 to-purple-50/30 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-4 hover:scale-105 transition-all duration-500 cursor-pointer group border-2 border-amber-200/50 hover:border-purple-300 backdrop-blur-sm"
      onClick={handleCardClick}
      data-testid={`card-${type}-${item.id}`}
    >
      <div className="relative">
        <div className="w-full h-72 bg-gradient-to-br from-purple-100 to-amber-100 flex items-center justify-center relative overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl.startsWith('@assets') ? 
                item.imageUrl.replace('@assets', '/attached_assets') : 
                item.imageUrl
              }
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter group-hover:brightness-110"
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
          <Badge className={`text-sm font-bold ${getStatusColor(item.status)} px-4 py-2 rounded-full shadow-lg`}>
            ✨ {getStatusText(item.status)}
          </Badge>
        </div>
        
        {/* Magical glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-amber-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-4 right-4">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/95 hover:bg-white p-3 rounded-full shadow-xl border-2 border-purple-200 hover:border-red-300 backdrop-blur-sm transform hover:scale-110 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            data-testid={`button-like-${item.id}`}
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-current text-red-500 animate-pulse" : "text-purple-600"} transition-all duration-300`} />
          </Button>
        </div>
      </div>
      <div className="p-8 bg-gradient-to-br from-white via-purple-50/30 to-amber-50/30">
        <h3 className="font-bold text-gray-800 mb-3 text-xl leading-tight bg-gradient-to-r from-purple-800 to-amber-600 bg-clip-text text-transparent" data-testid={`text-name-${item.id}`}>
          ✨ {item.name}
        </h3>
        <p className="text-gray-600 text-base mb-6 line-clamp-2 leading-relaxed" data-testid={`text-description-${item.id}`}>
          {item.description || "Divine costume crafted with mythological authenticity"}
        </p>
        
        <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-purple-100 to-amber-100 rounded-2xl p-4 border border-purple-200">
          <div>
            <p className="text-sm text-purple-600 font-medium mb-1">Daily Rental</p>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-amber-600 bg-clip-text text-transparent" data-testid={`text-price-${item.id}`}>
              ₹{parseFloat(item.pricePerDay).toFixed(0)}
            </span>
            <span className="text-sm text-purple-500 ml-2 font-medium">per day</span>
          </div>
          {sizes.length > 0 && (
            <div className="text-right">
              <p className="text-xs text-purple-600 uppercase tracking-wide font-bold mb-2">Available Sizes</p>
              <div className="flex flex-wrap gap-1 justify-end">
                {sizes.map((size, index) => (
                  <span key={index} className="text-xs font-bold bg-amber-200 text-purple-800 px-2 py-1 rounded-full">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Dialog open={showRentalForm} onOpenChange={setShowRentalForm}>
          <DialogTrigger asChild>
            <Button
              className={`w-full font-bold transition-all h-14 rounded-2xl text-lg ${
                isAvailable 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!isAvailable}
              data-testid={`button-rent-${item.id}`}
            >
              {isAvailable ? "🌟 Rent This Divine Costume" : "✨ Currently Unavailable"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
                ✨ Rent {item.name}
              </DialogTitle>
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
