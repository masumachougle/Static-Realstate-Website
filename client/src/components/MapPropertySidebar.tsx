import { Bed, Bath, Maximize, MapPin, Search, Star, X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { Property } from "@shared/schema";
import { getImageUrl } from "@/lib/imageMap";
import { formatFullPrice } from "@/lib/mapConfig";

interface MapPropertySidebarProps {
  properties: Property[];
  totalCount: number;
  selectedPropertyId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelect: (property: Property) => void;
  onClose: () => void;
}

export default function MapPropertySidebar({
  properties,
  totalCount,
  selectedPropertyId,
  searchQuery,
  onSearchChange,
  onSelect,
  onClose,
}: MapPropertySidebarProps) {
  const isSearching = searchQuery.trim().length > 0;

  return (
    <aside className="map-sidebar flex">
      <div className="map-sidebar-header">
        <div className="map-sidebar-header-row">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Listings
            </p>
            <h2 className="mt-1 text-lg font-heading font-light text-foreground">
              {isSearching
                ? `${properties.length} of ${totalCount} Properties`
                : `${totalCount} Properties`}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="map-sidebar-close"
            aria-label="Hide listings"
            data-testid="button-map-hide-listings"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="map-sidebar-search">
          <Search className="map-sidebar-search-icon" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title, location, type..."
            className="map-sidebar-search-input"
            aria-label="Search map listings"
            data-testid="input-map-search"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="map-sidebar-search-clear"
              aria-label="Clear search"
              data-testid="button-map-search-clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="map-sidebar-list">
        {properties.length === 0 ? (
          <div className="map-sidebar-empty">
            <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm font-medium text-foreground">No listings found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different title, location, or property type.
            </p>
          </div>
        ) : (
          properties.map((property) => {
          const isSelected = property.id === selectedPropertyId;
          const imageUrl = property.images[0] ? getImageUrl(property.images[0]) : null;
          const isFeatured = property.featured === "true";

          return (
            <button
              key={property.id}
              type="button"
              onClick={() => onSelect(property)}
              className={`map-sidebar-card ${isSelected ? "map-sidebar-card--selected" : ""}`}
            >
              <div className="map-sidebar-card-image">
                {imageUrl ? (
                  <img src={imageUrl} alt={property.title} />
                ) : (
                  <div className="map-sidebar-card-placeholder" />
                )}
                {isFeatured && (
                  <span className="map-sidebar-featured">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </span>
                )}
              </div>
              <div className="map-sidebar-card-body">
                <p className="map-sidebar-card-type">{property.propertyType}</p>
                <p className="map-sidebar-card-title">{property.title}</p>
                <p className="map-sidebar-card-location">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {property.location}
                </p>
                <div className="map-sidebar-card-footer">
                  <p className="map-sidebar-card-price">{formatFullPrice(property.price)}</p>
                  <div className="map-sidebar-card-meta">
                    {property.bedrooms != null && (
                      <span>
                        <Bed className="h-3 w-3" />
                        {property.bedrooms}
                      </span>
                    )}
                    {property.bathrooms != null && (
                      <span>
                        <Bath className="h-3 w-3" />
                        {property.bathrooms}
                      </span>
                    )}
                    {property.size != null && (
                      <span>
                        <Maximize className="h-3 w-3" />
                        {property.size.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
          })
        )}
      </div>
    </aside>
  );
}

interface MapPropertyDetailProps {
  property: Property | null;
  onClose: () => void;
}

export function MapPropertyDetail({ property, onClose }: MapPropertyDetailProps) {
  if (!property) return null;

  const imageUrl = property.images[0] ? getImageUrl(property.images[0]) : null;

  return (
    <div className="map-detail-panel">
      <button
        type="button"
        onClick={onClose}
        className="map-detail-close"
        aria-label="Close property details"
      >
        ×
      </button>
      {imageUrl && (
        <div className="map-detail-image">
          <img src={imageUrl} alt={property.title} />
          <div className="map-detail-image-overlay" />
        </div>
      )}
      <div className="map-detail-body">
        {property.featured === "true" && (
          <span className="map-detail-badge">
            <Star className="h-3 w-3 fill-current" />
            Featured Listing
          </span>
        )}
        <p className="map-detail-type">{property.propertyType}</p>
        <h3 className="map-detail-title">{property.title}</h3>
        <p className="map-detail-location">
          <MapPin className="h-4 w-4" />
          {property.location}
        </p>
        <p className="map-detail-price">{formatFullPrice(property.price)}</p>
        <div className="map-detail-meta">
          {property.bedrooms != null && (
            <span>
              <Bed className="h-4 w-4" />
              {property.bedrooms} Beds
            </span>
          )}
          {property.bathrooms != null && (
            <span>
              <Bath className="h-4 w-4" />
              {property.bathrooms} Baths
            </span>
          )}
          {property.size != null && (
            <span>
              <Maximize className="h-4 w-4" />
              {property.size.toLocaleString()} sqft
            </span>
          )}
        </div>
        <Link href={`/property/${property.id}`}>
          <Button className="w-full map-detail-cta" size="lg">
            Explore Property
          </Button>
        </Link>
      </div>
    </div>
  );
}
