import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/customer/product-card";
import SearchFilters from "@/components/customer/search-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Calendar, CreditCard, Truck, Crown, Star } from "lucide-react";
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
      <section className="hero-bg py-40 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-400 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-amber-300 rounded-full opacity-25 animate-pulse"></div>
          <div className="absolute bottom-20 right-1/3 w-14 h-14 bg-purple-300 rounded-full opacity-20 animate-bounce"></div>
        </div>
        
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <Sparkles className="h-16 w-16 text-amber-300 mx-auto mb-4 animate-pulse" />
            </div>
            
            <h1 className="text-7xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text mb-12 tracking-tight drop-shadow-2xl">
              Transform Into 
              <span className="block bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text">
                Legendary Characters
              </span>
            </h1>
            
            <div className="mb-16 max-w-5xl mx-auto">
              <p className="text-2xl md:text-3xl text-amber-100 font-semibold mb-4 drop-shadow-lg">
                ✨ Premium Indian Mythological Costumes & Accessories ✨
              </p>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-4xl mx-auto">
                Bring the divine stories of Krishna, Rama, Durga, and legendary heroes to life with our authentic, 
                handcrafted costumes that transport you into the realm of ancient mythology
              </p>
            </div>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border-2 border-amber-200 hover:border-amber-300 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-600" />
                  <Input
                    type="text"
                    placeholder="Search for divine characters, mythological themes, or costume types..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-14 pr-4 border-0 focus-visible:ring-2 focus-visible:ring-purple-500 text-lg h-16 bg-transparent placeholder:text-gray-500 text-gray-800 font-medium"
                    data-testid="input-search"
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-16 px-10 ml-4 font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" 
                  data-testid="button-search"
                >
                  <Search className="h-6 w-6 mr-3" />
                  Search Divine Collection
                </Button>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-purple-900 font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Crown className="h-6 w-6 mr-2" />
                Browse Divine Costumes
              </Button>
              <Button variant="outline" className="border-2 border-white/80 text-white hover:bg-white/20 backdrop-blur-sm font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Sparkles className="h-6 w-6 mr-2" />
                View Accessories
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
      <section className="py-32 section-light relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-end justify-between mb-24">
            <div>
              <div className="flex items-center mb-6">
                <Sparkles className="h-12 w-12 text-primary mr-4" />
                <h2 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-800 via-purple-600 to-amber-600 bg-clip-text text-transparent">
                  {activeTab === "costumes" ? "Divine Costume Collection" : "Exquisite Accessories"}
                </h2>
              </div>
              <p className="text-2xl text-gray-700 max-w-3xl leading-relaxed">
                {activeTab === "costumes" ? 
                  "✨ Authentic designs inspired by Indian mythology, crafted with premium materials and divine attention to detail that brings legends to life ✨" : 
                  "✨ Complete your transformation with meticulously curated accessories that embody the divine essence of legendary characters ✨"}
              </p>
            </div>
            <div className="text-right bg-gradient-to-br from-purple-100 to-amber-100 rounded-3xl p-8 shadow-xl border-2 border-purple-200">
              <p className="text-5xl font-bold bg-gradient-to-r from-purple-700 to-amber-600 bg-clip-text text-transparent">
                {activeTab === "costumes" ? costumes.length : accessories.length}
              </p>
              <p className="text-lg text-purple-600 uppercase tracking-wide font-bold mt-2">
                Divine Items Available
              </p>
              <div className="flex justify-center mt-3 space-x-1">
                <Star className="h-5 w-5 text-amber-500 fill-current" />
                <Star className="h-5 w-5 text-amber-500 fill-current" />
                <Star className="h-5 w-5 text-amber-500 fill-current" />
              </div>
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