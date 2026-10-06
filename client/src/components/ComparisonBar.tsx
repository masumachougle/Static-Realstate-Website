import { useComparison } from "@/contexts/ComparisonContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { getImageUrl } from "@/lib/imageMap";

export default function ComparisonBar() {
  const { selectedProperties, removeFromComparison, clearComparison } = useComparison();
  const [, setLocation] = useLocation();

  if (selectedProperties.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold">
              Compare Properties ({selectedProperties.length}/3)
            </h3>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-center">
            {selectedProperties.filter(p => p).map((property) => (
              <Card
                key={property.id}
                className="relative group w-32 hover-elevate"
                data-testid={`comparison-item-${property.id}`}
              >
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground"
                  onClick={() => removeFromComparison(property.id)}
                  data-testid={`button-remove-comparison-${property.id}`}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="aspect-video overflow-hidden rounded-t-md">
                  <img
                    src={getImageUrl(property.images[0])}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium line-clamp-1">{property.title}</p>
                  <p className="text-xs text-muted-foreground">
                    AED {(parseFloat(property.price) / 1000000).toFixed(1)}M
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={clearComparison}
              data-testid="button-clear-comparison"
            >
              Clear All
            </Button>
            <Button
              onClick={() => setLocation("/compare")}
              disabled={selectedProperties.length < 2}
              data-testid="button-view-comparison"
            >
              Compare Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
