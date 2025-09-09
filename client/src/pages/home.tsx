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
      <section className="hero-bg py-32 relative overflow-hidden">
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-12 tracking-tight">
              Transform Into Legendary Characters
            </h1>
            <p className="text-xl md:text-2xl text-white mb-16 max-w-4xl mx-auto leading-relaxed">
              Premium Indian Mythological Costumes & Accessories<br />
              <span className="text-lg md:text-xl text-white/80">Bring the divine stories of Krishna, Rama, Durga, and legendary heroes to life</span>
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 flex items-center border border-border">
              <Input
                type="text"
                placeholder="Search for characters, themes, or costume types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border-0 focus-visible:ring-0 text-lg h-14 bg-transparent"
                data-testid="input-search"
              />
              <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90 text-white h-14 px-8 ml-4 font-semibold" data-testid="button-search">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Categories */}
      <section className="section-light border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Tab Toggle */}
            <div className="flex gap-2">
              <Button
                variant={activeTab === "costumes" ? "default" : "secondary"}
                className={activeTab === "costumes" ? "bg-primary text-white shadow-lg font-semibold h-12 px-6" : "bg-white text-foreground hover:bg-accent h-12 px-6 border border-border"}
                onClick={() => setActiveTab("costumes")}
                data-testid="tab-costumes"
              >
                Costumes
              </Button>
              <Button
                variant={activeTab === "accessories" ? "default" : "secondary"}
                className={activeTab === "accessories" ? "bg-primary text-white shadow-lg font-semibold h-12 px-6" : "bg-white text-foreground hover:bg-accent h-12 px-6 border border-border"}
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
                className={`cursor-pointer transition-all hover:scale-105 ${!filters.category ? 'bg-primary text-white shadow-md border-0' : 'bg-white hover:bg-accent text-foreground border border-border'}`}
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
                      ? 'bg-primary text-white shadow-md border-0' 
                      : 'bg-white hover:bg-accent text-foreground border border-border'
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
                className="border-border text-foreground hover:bg-accent" 
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
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-20">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                {activeTab === "costumes" ? "Divine Costume Collection" : "Exquisite Accessories"}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl">
                {activeTab === "costumes" ? "Authentic designs inspired by Indian mythology, crafted with premium materials and attention to detail" : "Complete your transformation with meticulously curated accessories that bring your character to life"}
              </p>
            </div>
            <div className="text-right bg-accent rounded-2xl p-6">
              <p className="text-3xl font-bold text-primary">
                {activeTab === "costumes" ? costumes.length : accessories.length}
              </p>
              <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
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
              <Button onClick={clearFilters} className="bg-primary text-white hover:bg-primary/90">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="section-dark py-32 relative overflow-hidden">
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <h2 className="text-6xl font-bold text-white mb-10 tracking-tight">How It Works</h2>
              <p className="text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">Transform into legendary characters through our streamlined rental process</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="text-center bg-white/5 rounded-3xl p-10 border border-white/10 hover:-translate-y-2 transition-all duration-300">
                <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Search className="h-8 w-8 text-slate-700" />
                </div>
                <div className="bg-white/10 rounded-full px-4 py-2 text-xs font-bold text-white/80 mb-6 inline-block">
                  01
                </div>
                <h3 className="font-bold text-white mb-6 text-2xl">Browse & Select</h3>
                <p className="text-white/80 text-lg leading-relaxed">Discover authentic mythological characters from our curated divine collection</p>
              </div>
              
              <div className="text-center bg-white/5 rounded-3xl p-10 border border-white/10 hover:-translate-y-2 transition-all duration-300">
                <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Calendar className="h-8 w-8 text-slate-700" />
                </div>
                <div className="bg-white/10 rounded-full px-4 py-2 text-xs font-bold text-white/80 mb-6 inline-block">
                  02
                </div>
                <h3 className="font-bold text-white mb-6 text-2xl">Pick Dates</h3>
                <p className="text-white/80 text-lg leading-relaxed">Choose your rental dates and confirm costume availability</p>
              </div>
              
              <div className="text-center bg-white/5 rounded-3xl p-10 border border-white/10 hover:-translate-y-2 transition-all duration-300">
                <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <CreditCard className="h-8 w-8 text-slate-700" />
                </div>
                <div className="bg-white/10 rounded-full px-4 py-2 text-xs font-bold text-white/80 mb-6 inline-block">
                  03
                </div>
                <h3 className="font-bold text-white mb-6 text-2xl">Secure Payment</h3>
                <p className="text-white/80 text-lg leading-relaxed">Complete safe and secure payment with flexible options</p>
              </div>
              
              <div className="text-center bg-white/5 rounded-3xl p-10 border border-white/10 hover:-translate-y-2 transition-all duration-300">
                <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Truck className="h-8 w-8 text-slate-700" />
                </div>
                <div className="bg-white/10 rounded-full px-4 py-2 text-xs font-bold text-white/80 mb-6 inline-block">
                  04
                </div>
                <h3 className="font-bold text-white mb-6 text-2xl">Transform & Shine</h3>
                <p className="text-white/80 text-lg leading-relaxed">Pickup your costume and embody the legendary character</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}