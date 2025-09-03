import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Filters {
  category?: string;
  size?: string;
  theme?: string;
  search?: string;
  status?: string;
}

interface SearchFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  itemType: "costumes" | "accessories";
}

export default function SearchFilters({ filters, onFiltersChange, itemType }: SearchFiltersProps) {
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
  ];

  const themeOptions = itemType === "costumes" 
    ? ["Historical", "Superheroes", "Fantasy", "Halloween", "Medieval", "Victorian", "Pirate"]
    : ["Formal", "Casual", "Vintage", "Modern"];

  return (
    <section className="bg-white border-b border-border py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                value={filters.size || "all-sizes"}
                onValueChange={(value) => onFiltersChange({ ...filters, size: value === "all-sizes" ? undefined : value })}
              >
                <SelectTrigger data-testid="select-size">
                  <SelectValue placeholder="All Sizes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-sizes">All Sizes</SelectItem>
                  {sizeOptions.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {itemType === "costumes" && (
                <Select
                  value={filters.theme || "all-themes"}
                  onValueChange={(value) => onFiltersChange({ ...filters, theme: value === "all-themes" ? undefined : value })}
                >
                  <SelectTrigger data-testid="select-theme">
                    <SelectValue placeholder="All Themes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-themes">All Themes</SelectItem>
                    {themeOptions.map((theme) => (
                      <SelectItem key={theme} value={theme}>
                        {theme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select
                value={filters.status || "all-status"}
                onValueChange={(value) => onFiltersChange({ ...filters, status: value === "all-status" ? undefined : value })}
              >
                <SelectTrigger data-testid="select-status">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger data-testid="select-sort">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
