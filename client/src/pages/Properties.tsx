import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters, { type FilterState } from "@/components/PropertyFilters";
import { getImageUrl } from "@/lib/imageMap";
import type { Property } from "@shared/schema";
import { Card } from "@/components/ui/card";

export default function Properties() {
  const [filters, setFilters] = useState<FilterState>({
    propertyType: "all",
    location: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "all",
  });

  const queryParams = new URLSearchParams();
  if (filters.propertyType !== "all") queryParams.append("propertyType", filters.propertyType);
  if (filters.location !== "all") queryParams.append("location", filters.location);
  if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
  if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
  if (filters.bedrooms !== "all") queryParams.append("bedrooms", filters.bedrooms);

  const queryString = queryParams.toString();
  const queryKey = queryString ? `/api/properties?${queryString}` : "/api/properties";

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: [queryKey],
  });

  const handleFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="pt-20">
      <div className="page-hero">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="page-container-wide page-hero-content">
          <div className="page-hero-text page-hero-text-standalone">
            <h1 className="page-hero-title">
              Find the Ideal{" "}
              <span className="text-gradient-highlight">
                Property for You!
              </span>
            </h1>
            <p className="page-hero-description">
              Explore our exclusive selection of luxury properties in Dubai's most popular locations.
            </p>
          </div>
        </div>
      </div>

      <div className="page-container-wide py-8 sm:py-12">
        <PropertyFilters onFilter={handleFilter} />

        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{properties.length}</span> properties
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-96 animate-pulse bg-muted" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                No properties found matching your criteria
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  image={getImageUrl(property.images[0])}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
