import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, SlidersHorizontal } from "lucide-react";

interface PropertyFiltersProps {
  onFilter: (filters: FilterState) => void;
}

export interface FilterState {
  propertyType: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
}

export default function PropertyFilters({ onFilter }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    propertyType: "all",
    location: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "all",
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilter(filters);
    console.log("Filters applied:", filters);
  };

  return (
    <Card className="p-4 sm:p-6 shadow-sm border-card-border">
      <div className="flex items-center gap-2 mb-5 sm:mb-6">
        <SlidersHorizontal className="h-5 w-5 text-primary shrink-0" />
        <h3 className="text-base sm:text-lg font-heading font-semibold">Filter Properties</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label htmlFor="property-type">Property Type</Label>
          <Select
            value={filters.propertyType}
            onValueChange={(value) => handleFilterChange("propertyType", value)}
          >
            <SelectTrigger id="property-type" data-testid="select-property-type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Penthouse">Penthouse</SelectItem>
              <SelectItem value="Townhouse">Townhouse</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select
            value={filters.location}
            onValueChange={(value) => handleFilterChange("location", value)}
          >
            <SelectTrigger id="location" data-testid="select-location">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Palm Jumeirah">Palm Jumeirah</SelectItem>
              <SelectItem value="Dubai Marina">Dubai Marina</SelectItem>
              <SelectItem value="Downtown Dubai">Downtown Dubai</SelectItem>
              <SelectItem value="Business Bay">Business Bay</SelectItem>
              <SelectItem value="Jumeirah Beach">Jumeirah Beach</SelectItem>
              <SelectItem value="Arabian Ranches">Arabian Ranches</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="min-price">Min Price (AED)</Label>
          <Input
            id="min-price"
            type="text"
            placeholder="e.g., 1000000"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            data-testid="input-min-price"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-price">Max Price (AED)</Label>
          <Input
            id="max-price"
            type="text"
            placeholder="e.g., 10000000"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            data-testid="input-max-price"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Select
            value={filters.bedrooms}
            onValueChange={(value) => handleFilterChange("bedrooms", value)}
          >
            <SelectTrigger id="bedrooms" data-testid="select-bedrooms">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        className="w-full sm:w-auto sm:min-w-[200px] mt-5 sm:mt-6"
        onClick={applyFilters}
        data-testid="button-apply-filters"
      >
        <Search className="mr-2 h-4 w-4" />
        Search Properties
      </Button>
    </Card>
  );
}
