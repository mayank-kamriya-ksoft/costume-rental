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
      <section className="bright-gradient py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/30"></div>
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-2xl tracking-tight">
              Transform Into Legendary Characters
            </h1>
            <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-4xl mx-auto drop-shadow-lg leading-relaxed">
              Premium Indian Mythological Costumes & Accessories<br />
              <span className="text-lg md:text-xl text-white/80">Bring the divine stories of Krishna, Rama, Durga, and legendary heroes to life</span>
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl p-4 flex items-center border border-white/60">
              <Input
                type="text"
                placeholder="Search for characters, themes, or costume types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border-0 focus-visible:ring-0 text-lg h-12 bg-transparent"
                data-testid="input-search"
              />
              <Button onClick={handleSearch} className="professional-gradient hover:opacity-90 text-white shadow-lg h-12 px-6 ml-2" data-testid="button-search">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Categories */}
      <section className="elegant-gradient border-b border-primary/20 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Tab Toggle */}
            <div className="flex gap-2">
              <Button
                variant={activeTab === "costumes" ? "default" : "secondary"}
                className={activeTab === "costumes" ? "professional-gradient text-white shadow-lg font-semibold" : "bg-white/80 text-foreground hover:bg-white"}
                onClick={() => setActiveTab("costumes")}
                data-testid="tab-costumes"
              >
                Costumes
              </Button>
              <Button
                variant={activeTab === "accessories" ? "default" : "secondary"}
                className={activeTab === "accessories" ? "professional-gradient text-white shadow-lg font-semibold" : "bg-white/80 text-foreground hover:bg-white"}
                onClick={() => setActiveTab("accessories")}
                data-testid="tab-accessories"
              >
                Accessories
              </Button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!filters.category ? "default" : "secondary"}
                className={`cursor-pointer transition-all hover:scale-105 ${!filters.category ? 'professional-gradient text-white shadow-lg border-0' : 'bg-white/80 hover:bg-white text-foreground border border-primary/20'}`}
                onClick={() => setFilters({ ...filters, category: undefined })}
                data-testid="filter-all"
              >
                All Categories
              </Badge>
              {(activeTab === "costumes" ? costumeCategories : accessoryCategories).map((category) => (
                <Badge
                  key={category.id}
                  variant={filters.category === category.id ? "default" : "secondary"}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    filters.category === category.id 
                      ? 'professional-gradient text-white shadow-lg border-0' 
                      : 'bg-white/80 hover:bg-white text-foreground border border-primary/20'
                  }`}
                  onClick={() => setFilters({ ...filters, category: category.id })}
                  data-testid={`filter-category-${category.id}`}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
            
            {/* Clear Filters */}
            {(filters.category || filters.search || filters.size) && (
              <Button 
                variant="outline" 
                className="border-primary/30 text-primary hover:bg-primary/5" 
                onClick={clearFilters} 
                data-testid="button-clear-filters"
              >
                Clear Filters
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
      <section className="py-20 bg-gradient-to-br from-white via-background to-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {activeTab === "costumes" ? "Divine Costume Collection" : "Exquisite Accessories"}
              </h2>
              <p className="text-xl text-muted-foreground">
                {activeTab === "costumes" ? "Authentic designs inspired by Indian mythology" : "Complete your transformation with perfect accessories"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {activeTab === "costumes" ? costumes.length : accessories.length}
              </p>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                Available Items
              </p>
            </div>
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
            <div className="text-center py-16">
              <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-foreground mb-4">No items found</h3>
              <p className="text-lg text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
              <Button onClick={clearFilters} className="professional-gradient text-white">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 indian-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-white mb-8 drop-shadow-lg tracking-tight">How It Works</h2>
              <p className="text-2xl text-white/95 drop-shadow-md max-w-3xl mx-auto leading-relaxed">Transform into legendary characters in just four simple steps</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:scale-105 transition-all duration-300 hover:bg-white/15">
                <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/30">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-1 text-sm font-bold text-white mb-4 inline-block">
                  STEP 1
                </div>
                <h3 className="font-bold text-white mb-4 text-xl">Browse & Select</h3>
                <p className="text-white/90 text-base leading-relaxed">Discover authentic mythological characters from our curated divine collection</p>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:scale-105 transition-all duration-300 hover:bg-white/15">
                <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/30">
                  <Calendar className="h-10 w-10 text-white" />
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-1 text-sm font-bold text-white mb-4 inline-block">
                  STEP 2
                </div>
                <h3 className="font-bold text-white mb-4 text-xl">Pick Dates</h3>
                <p className="text-white/90 text-base leading-relaxed">Choose your rental dates and confirm costume availability</p>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:scale-105 transition-all duration-300 hover:bg-white/15">
                <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/30">
                  <CreditCard className="h-10 w-10 text-white" />
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-1 text-sm font-bold text-white mb-4 inline-block">
                  STEP 3
                </div>
                <h3 className="font-bold text-white mb-4 text-xl">Secure Payment</h3>
                <p className="text-white/90 text-base leading-relaxed">Complete safe and secure payment with flexible options</p>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:scale-105 transition-all duration-300 hover:bg-white/15">
                <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/30">
                  <Truck className="h-10 w-10 text-white" />
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-1 text-sm font-bold text-white mb-4 inline-block">
                  STEP 4
                </div>
                <h3 className="font-bold text-white mb-4 text-xl">Transform & Shine</h3>
                <p className="text-white/90 text-base leading-relaxed">Pickup your costume and embody the legendary character</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}