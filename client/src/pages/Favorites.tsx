import { useFavorites } from "@/contexts/FavoritesContext";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import PropertyCard from "@/components/PropertyCard";
import { getImageUrl } from "@/lib/imageMap";

export default function Favorites() {
  const { favorites, clearFavorites } = useFavorites();
  const [, setLocation] = useLocation();

  if (favorites.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-3xl font-heading font-semibold mb-4">
            No Saved Properties
          </h2>
          <p className="text-muted-foreground mb-6">
            You haven't saved any properties yet. Browse our listings and save your favorites for easy access.
          </p>
          <Button onClick={() => setLocation("/properties")} data-testid="button-browse-properties">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-hero-title">
              Saved <span className="font-semibold">Properties</span>
            </h1>
            <p className="page-hero-description">
              {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved for later
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setLocation("/properties")}
              data-testid="button-back"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Button>
            <Button
              variant="outline"
              onClick={clearFavorites}
              data-testid="button-clear-favorites"
            >
              Clear All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              image={getImageUrl(property.images[0])}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
