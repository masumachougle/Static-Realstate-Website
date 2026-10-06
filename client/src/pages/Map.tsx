import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, List, MapPin } from "lucide-react";
import { Link } from "wouter";
import PropertiesMap from "@/components/PropertiesMap";
import MapPropertySidebar, { MapPropertyDetail } from "@/components/MapPropertySidebar";
import type { Property } from "@shared/schema";

function filterMapProperties(properties: Property[], searchQuery: string) {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return properties;

  return properties.filter(
    (property) =>
      property.title.toLowerCase().includes(query) ||
      property.location.toLowerCase().includes(query) ||
      property.propertyType.toLowerCase().includes(query) ||
      property.description.toLowerCase().includes(query),
  );
}

export default function MapPage() {
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredProperties = useMemo(
    () => filterMapProperties(properties, searchQuery),
    [properties, searchQuery],
  );

  const selectedProperty = useMemo(
    () => filteredProperties.find((property) => property.id === selectedPropertyId) ?? null,
    [filteredProperties, selectedPropertyId],
  );

  const handleSelect = (property: Property) => {
    setSelectedPropertyId(property.id);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (
      selectedPropertyId &&
      query.trim() &&
      !filterMapProperties(properties, query).some((property) => property.id === selectedPropertyId)
    ) {
      setSelectedPropertyId(null);
    }
  };

  return (
    <div className="map-page relative bg-[#ddd8c8]">
      <Link href="/">
        <button
          type="button"
          className="map-back-button"
          aria-label="Back to home"
          data-testid="button-map-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </Link>

      <div className="map-page-layout">
        <div className="map-canvas relative min-h-[520px]">
          {isLoading ? (
            <div className="absolute inset-0 map-loading-shimmer" />
          ) : properties.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="map-empty-state">
                <MapPin className="mx-auto mb-4 h-10 w-10 text-primary" />
                <p className="text-lg font-heading text-foreground">No properties on the map yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Check back soon for luxury listings across Dubai.
                </p>
              </div>
            </div>
          ) : (
            <PropertiesMap
              properties={filteredProperties}
              className="h-full w-full"
              showCommunityLabels={false}
              selectedPropertyId={selectedPropertyId}
              onPropertySelect={handleSelect}
            />
          )}

          <div className="map-vignette pointer-events-none" />
          <div className="map-top-glow pointer-events-none" />

          {!isLoading && properties.length > 0 && !sidebarOpen && (
            <button
              type="button"
              className="map-listings-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Show listings"
              data-testid="button-map-show-listings"
            >
              <List className="h-4 w-4" />
              Listings
            </button>
          )}

          {selectedProperty && (
            <div className="map-detail-overlay lg:hidden pointer-events-auto">
              <MapPropertyDetail
                property={selectedProperty}
                onClose={() => setSelectedPropertyId(null)}
              />
            </div>
          )}
        </div>

        {!isLoading && properties.length > 0 && sidebarOpen && (
          <MapPropertySidebar
            properties={filteredProperties}
            totalCount={properties.length}
            selectedPropertyId={selectedPropertyId}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSelect={handleSelect}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
