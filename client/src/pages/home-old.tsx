import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
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
      <section className="bg-gradient-to-br from-primary/10 to-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Find Your Perfect Costume
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Premium costume and accessory rentals for every occasion. From elegant period pieces to superhero outfits.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-2 flex items-center">
            <Input
              type="text"
              placeholder="Search costumes, themes, or occasions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-0 focus-visible:ring-0"
              data-testid="input-search"
            />
            <Button onClick={handleSearch} data-testid="button-search">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Filters and Categories */}
      <section className="bg-white border-b border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Tab Toggle */}
            <div className="flex gap-2">
              <Button
                variant={activeTab === "costumes" ? "default" : "secondary"}
                onClick={() => setActiveTab("costumes")}
                data-testid="tab-costumes"
              >
                Costumes
              </Button>
              <Button
                variant={activeTab === "accessories" ? "default" : "secondary"}
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
                className="cursor-pointer"
                onClick={() => setFilters({ ...filters, category: undefined })}
                data-testid="filter-all"
              >
                All
              </Badge>
              {(activeTab === "costumes" ? costumeCategories : accessoryCategories).map((category) => (
                <Badge
                  key={category.id}
                  variant={filters.category === category.id ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setFilters({ ...filters, category: category.id })}
                  data-testid={`filter-category-${category.id}`}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
            
            {/* Clear Filters */}
            {(filters.category || filters.search || filters.size) && (
              <Button variant="outline" onClick={clearFilters} data-testid="button-clear-filters">
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
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              {activeTab === "costumes" ? "Featured Costumes" : "Accessories"}
            </h2>
            <p className="text-muted-foreground">
              {activeTab === "costumes" ? costumes.length : accessories.length} items
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
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground">Simple 4-step process to get your perfect costume</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">1. Browse & Select</h3>
              <p className="text-muted-foreground text-sm">Choose your costume and accessories from our extensive collection</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">2. Pick Dates</h3>
              <p className="text-muted-foreground text-sm">Select your rental period and check availability</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">3. Secure Payment</h3>
              <p className="text-muted-foreground text-sm">Pay rental fee and security deposit online</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">4. Pickup & Enjoy</h3>
              <p className="text-muted-foreground text-sm">Collect your costume and return it after your event</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
