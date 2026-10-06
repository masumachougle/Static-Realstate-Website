import { Heart, Bed, Bath, Maximize } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { useComparison } from "@/contexts/ComparisonContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import type { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
  image: string;
}

export default function PropertyCard({
  property,
  image,
}: PropertyCardProps) {
  const { addToComparison, removeFromComparison, isInComparison, selectedProperties } = useComparison();
  const { addToFavorites, removeFromFavorites: removeFavorite, isFavorite } = useFavorites();
  const isChecked = isInComparison(property.id);
  const canAdd = selectedProperties.length < 3 || isChecked;
  const isFav = isFavorite(property.id);

  const handleComparisonChange = (checked: boolean) => {
    if (checked) {
      addToComparison(property);
    } else {
      removeFromComparison(property.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFav) {
      removeFavorite(property.id);
    } else {
      addToFavorites(property);
    }
  };

  return (
    <Card className="overflow-hidden group hover-elevate transition-all duration-300 shadow-sm hover:shadow-lg border-card-border h-full flex flex-col">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-2 max-w-[60%]">
          <Badge className="bg-primary text-primary-foreground shadow-sm">
            {property.propertyType}
          </Badge>
          {property.status === "sold" && (
            <Badge className="bg-destructive text-destructive-foreground shadow-sm">
              Sold
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-background/90 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm">
            <Checkbox
              checked={isChecked}
              onCheckedChange={handleComparisonChange}
              disabled={!canAdd}
              data-testid={`checkbox-compare-${property.id}`}
            />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">Compare</span>
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-background/90 backdrop-blur-sm shadow-sm"
            onClick={handleFavoriteClick}
            data-testid={`button-favorite-${property.id}`}
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <div className="mb-3">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{property.location}</p>
          <h3 className="text-lg sm:text-xl font-heading font-semibold line-clamp-2">{property.title}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 text-sm text-muted-foreground">
          {property.bedrooms && (
            <div className="flex items-center gap-1.5">
              <Bed className="h-4 w-4 shrink-0" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 shrink-0" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.size && (
            <div className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4 shrink-0" />
              <span>{property.size.toLocaleString()} sqft</span>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between pt-4 border-t mt-auto gap-3">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground mb-0.5">Price</p>
            <p className="text-xl sm:text-2xl font-heading font-semibold text-primary truncate">
              AED {(parseFloat(property.price) / 1000000).toFixed(1)}M
            </p>
          </div>
          <Link href={`/property/${property.id}`}>
            <Button
              size="sm"
              className="shrink-0 sm:h-10 sm:px-4"
              data-testid={`button-view-details-${property.id}`}
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
