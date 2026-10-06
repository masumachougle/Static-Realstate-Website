import { Fragment } from "react";
import { useComparison } from "@/contexts/ComparisonContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X as XIcon } from "lucide-react";
import { getImageUrl } from "@/lib/imageMap";

export default function PropertyComparison() {
  const { selectedProperties, clearComparison } = useComparison();
  const [, setLocation] = useLocation();

  if (selectedProperties.length < 2) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-semibold mb-4">No Properties to Compare</h2>
          <p className="text-muted-foreground mb-6">
            Please select at least 2 properties to compare
          </p>
          <Button onClick={() => setLocation("/properties")} data-testid="button-back-to-properties">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse Properties
          </Button>
        </div>
      </div>
    );
  }

  const comparisonData = [
    { label: "Price", getValue: (p: typeof selectedProperties[0]) => `AED ${(parseFloat(p.price) / 1000000).toFixed(1)}M` },
    { label: "Property Type", getValue: (p: typeof selectedProperties[0]) => p.propertyType },
    { label: "Location", getValue: (p: typeof selectedProperties[0]) => p.location },
    { label: "Bedrooms", getValue: (p: typeof selectedProperties[0]) => p.bedrooms ? `${p.bedrooms} beds` : "N/A" },
    { label: "Bathrooms", getValue: (p: typeof selectedProperties[0]) => p.bathrooms ? `${p.bathrooms} baths` : "N/A" },
    { label: "Size", getValue: (p: typeof selectedProperties[0]) => p.size ? `${p.size.toLocaleString()} sqft` : "N/A" },
  ];

  // Get all unique amenities
  const allAmenities = Array.from(
    new Set(selectedProperties.flatMap((p) => p.amenities || []))
  );

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="outline"
              onClick={() => setLocation("/properties")}
              className="mb-4"
              data-testid="button-back"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Button>
            <h1 className="page-hero-title">
              Property <span className="font-semibold">Comparison</span>
            </h1>
            <p className="page-hero-description">
              Compare features and pricing side-by-side
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              clearComparison();
              setLocation("/properties");
            }}
            data-testid="button-clear-and-exit"
          >
            Clear & Exit
          </Button>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
          {/* Header Row - Property Cards */}
          <div></div>
          {selectedProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden" data-testid={`comparison-column-${property.id}`}>
              <div className="aspect-video overflow-hidden">
                <img
                  src={getImageUrl(property.images[0])}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <Badge className="mb-2">{property.propertyType}</Badge>
                <h3 className="font-heading font-semibold text-lg line-clamp-2 mb-2">
                  {property.title}
                </h3>
                <p className="text-sm text-muted-foreground">{property.location}</p>
              </div>
            </Card>
          ))}

          {/* Basic Specifications */}
          {comparisonData.map((row, index) => (
            <Fragment key={`row-${index}`}>
              <div
                className="flex items-center py-4 px-4 bg-muted/50 rounded-md font-medium"
              >
                {row.label}
              </div>
              {selectedProperties.map((property) => (
                <div
                  key={`${property.id}-${index}`}
                  className="flex items-center py-4 px-4 border-b"
                  data-testid={`comparison-value-${property.id}-${row.label.toLowerCase().replace(' ', '-')}`}
                >
                  {row.getValue(property)}
                </div>
              ))}
            </Fragment>
          ))}

          {/* Amenities Section */}
          <div className="col-span-full mt-8">
            <h2 className="text-2xl font-heading font-semibold mb-4">Features & Amenities</h2>
          </div>

          {allAmenities.map((amenity, index) => (
            <Fragment key={`amenity-row-${index}`}>
              <div
                className="flex items-center py-3 px-4 bg-muted/50 rounded-md text-sm"
              >
                {amenity}
              </div>
              {selectedProperties.map((property) => (
                <div
                  key={`${property.id}-amenity-${index}`}
                  className="flex items-center justify-center py-3 px-4 border-b"
                  data-testid={`comparison-amenity-${property.id}-${index}`}
                >
                  {property.amenities?.includes(amenity) ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <XIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </Fragment>
          ))}

          {/* Description Section */}
          <div className="col-span-full mt-8">
            <h2 className="text-2xl font-heading font-semibold mb-4">Description</h2>
          </div>
          <div className="flex items-start py-3 px-4 bg-muted/50 rounded-md font-medium">
            Details
          </div>
          {selectedProperties.map((property) => (
            <Card key={`desc-${property.id}`} className="p-4">
              <p className="text-sm text-muted-foreground line-clamp-4">
                {property.description}
              </p>
            </Card>
          ))}

          {/* Action Buttons */}
          <div></div>
          {selectedProperties.map((property) => (
            <div key={`action-${property.id}`} className="flex flex-col gap-2 mt-4">
              <Button
                onClick={() => setLocation(`/property/${property.id}`)}
                data-testid={`button-view-details-${property.id}`}
              >
                View Full Details
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/contact")}
                data-testid={`button-inquire-${property.id}`}
              >
                Inquire Now
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
