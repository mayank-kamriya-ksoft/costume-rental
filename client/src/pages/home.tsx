import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/customer/product-card";
import SearchFilters from "@/components/customer/search-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Calendar, CreditCard, Truck } from "lucide-react";
import type { Costume, Accessory, Category } from "@shared/schema";

interface Filters {
  category?: string;
  size?: string;
  theme?: string;
  search?: string;
  status?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"costumes" | "accessories">("costumes");
  const [filters, setFilters] = useState<Filters>({});
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  const costumeCategories = categories.filter(c => c.type === 'costume');
  const accessoryCategories = categories.filter(c => c.type === 'accessory');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bright-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-purple-500/20 to-yellow-400/20"></div>
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              🎭 Transform Into Epic Characters! 🎭
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-lg">
              🌟 Premium Indian Mythological Costumes & Accessories 🌟<br />
              Bring Krishna, Rama, Durga, and more legendary characters to life!
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-3 flex items-center border-2 border-white/50">
              <Input
                type="text"
                placeholder="Search for your favorite mythological character..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border-0 focus-visible:ring-0"
                data-testid="input-search"
              />
              <Button onClick={handleSearch} className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white shadow-lg" data-testid="button-search">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Categories */}
      <section className="bg-gradient-to-r from-yellow-50 via-orange-50 to-purple-50 border-b border-orange-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Tab Toggle */}
            <div className="flex gap-2">
              <Button
                variant={activeTab === "costumes" ? "default" : "secondary"}
                className={activeTab === "costumes" ? "bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg" : ""}
                onClick={() => setActiveTab("costumes")}
                data-testid="tab-costumes"
              >
                🎭 Costumes
              </Button>
              <Button
                variant={activeTab === "accessories" ? "default" : "secondary"}
                className={activeTab === "accessories" ? "bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg" : ""}
                onClick={() => setActiveTab("accessories")}
                data-testid="tab-accessories"
              >
                ✨ Accessories
              </Button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!filters.category ? "default" : "secondary"}
                className={`cursor-pointer transition-all hover:scale-105 ${!filters.category ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg' : 'hover:bg-orange-100'}`}
                onClick={() => setFilters({ ...filters, category: undefined })}
                data-testid="filter-all"
              >
                🌟 All
              </Badge>
              {(activeTab === "costumes" ? costumeCategories : accessoryCategories).map((category) => (
                <Badge
                  key={category.id}
                  variant={filters.category === category.id ? "default" : "secondary"}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    filters.category === category.id 
                      ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg' 
                      : 'hover:bg-orange-100'
                  }`}
                  onClick={() => setFilters({ ...filters, category: category.id })}
                  data-testid={`filter-category-${category.id}`}
                >
                  {category.name === 'God' ? '🔯' : 
                   category.name === 'Goddess' ? '🌸' : 
                   category.name === 'Warrior' ? '⚔️' : 
                   category.name === 'Demon' ? '👹' : 
                   category.name === 'Sage' ? '🧙‍♂️' : 
                   category.name === 'Royal' ? '👑' : '✨'} {category.name}
                </Badge>
              ))}
            </div>
            
            {/* Clear Filters */}
            {(filters.category || filters.search || filters.size) && (
              <Button 
                variant="outline" 
                className="border-orange-300 text-orange-600 hover:bg-orange-50" 
                onClick={clearFilters} 
                data-testid="button-clear-filters"
              >
                🗑️ Clear Filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Search Filters */}
      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        itemType={activeTab}
      />

      {/* Products Grid */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              {activeTab === "costumes" ? "🎭 Divine Costumes Collection" : "✨ Magical Accessories"}
            </h2>
            <p className="text-lg font-semibold text-orange-600 bg-orange-100 px-4 py-2 rounded-full">
              {activeTab === "costumes" ? costumes.length : accessories.length} amazing items
            </p>
          </div>
          
          {(costumesLoading || accessoriesLoading) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-64 bg-muted"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeTab === "costumes"
                ? costumes.map((costume: Costume) => (
                    <ProductCard key={costume.id} item={costume} type="costume" />
                  ))
                : accessories.map((accessory: Accessory) => (
                    <ProductCard key={accessory.id} item={accessory} type="accessory" />
                  ))
              }
            </div>
          )}

          {((activeTab === "costumes" && costumes.length === 0) || 
            (activeTab === "accessories" && accessories.length === 0)) && 
            !costumesLoading && !accessoriesLoading && (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 indian-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">🌟 How It Works 🌟</h2>
              <p className="text-xl text-white/90 drop-shadow-md">Transform into epic characters in just 4 simple steps!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:scale-105 transition-transform">
                <div className="bg-yellow-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Search className="h-8 w-8 text-orange-800" />
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">🔍 1. Browse & Select</h3>
                <p className="text-white/90 text-sm">Discover amazing mythological characters from our divine collection</p>
              </div>
              
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:scale-105 transition-transform">
                <div className="bg-yellow-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Calendar className="h-8 w-8 text-orange-800" />
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">📅 2. Pick Dates</h3>
                <p className="text-white/90 text-sm">Choose your dates and ensure perfect availability</p>
              </div>
              
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:scale-105 transition-transform">
                <div className="bg-yellow-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CreditCard className="h-8 w-8 text-orange-800" />
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">💳 3. Secure Payment</h3>
                <p className="text-white/90 text-sm">Safe and secure payment with flexible options</p>
              </div>
              
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:scale-105 transition-transform">
                <div className="bg-yellow-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Truck className="h-8 w-8 text-orange-800" />
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">🎭 4. Transform & Shine</h3>
                <p className="text-white/90 text-sm">Pickup your costume and become the epic character!</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}