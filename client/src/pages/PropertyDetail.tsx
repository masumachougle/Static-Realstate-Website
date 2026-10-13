import { useRoute, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Heart,
  Share2,
  Calendar,
  Phone,
  Mail,
  ArrowLeft,
  Calculator,
} from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import type { Property } from "@shared/schema";
import VirtualTour from "@/components/VirtualTour";
import ImageGalleryLightbox from "@/components/ImageGalleryLightbox";
import CurrencyConverter from "@/components/CurrencyConverter";
import MapLocation from "@/components/MapLocation";
import MortgageCalculator from "@/components/MortgageCalculator";
import { getPropertyCoordinates } from "@/lib/locationCoordinates";
import { useViewingBooking } from "@/contexts/ViewingBookingContext";
import { contactInfo } from "@/lib/contactInfo";

export default function PropertyDetail() {
  const [, params] = useRoute("/property/:id");
  const [, setLocation] = useLocation();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { openViewingBooking } = useViewingBooking();

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: [`/api/properties/${params?.id}`],
    enabled: !!params?.id,
  });

  if (isLoading) {
    return (
      <div className="page-offset-nav min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="page-offset-nav min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-semibold mb-2">Property Not Found</h2>
          <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist.</p>
          <Link href="/properties">
            <Button data-testid="button-back-to-properties">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const features = property.amenities || [];
  const isFav = isFavorite(property.id);
  const { lat, lng } = getPropertyCoordinates(property.location);

  const handleFavoriteClick = () => {
    if (isFav) {
      removeFromFavorites(property.id);
    } else {
      addToFavorites(property);
    }
  };

  const scrollToMortgageCalculator = () => {
    document.getElementById("mortgage-calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const propertyPrice = parseFloat(property.price);

  return (
    <div className="page-offset-nav bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 lg:pb-10">
        <div className="page-subnav -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-4 bg-background/95 backdrop-blur-sm border-b border-border/40">
          <Link href="/properties">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 shadow-sm"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Properties
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative group">
              <div className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-border/50">
                <ImageGalleryLightbox images={property.images} />
              </div>
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-background/90 backdrop-blur-sm shadow-md hover:bg-background"
                  onClick={() => console.log("Share clicked")}
                  data-testid="button-share"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-background/90 backdrop-blur-sm shadow-md hover:bg-background"
                  onClick={handleFavoriteClick}
                  data-testid="button-favorite"
                >
                  <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>
            </div>

            <div>
              <Badge className="mb-3">{property.propertyType}</Badge>
              <h1 className="text-3xl sm:text-4xl font-heading font-semibold mb-3 leading-tight">
                {property.title}
              </h1>
              <div className="flex items-center text-muted-foreground mb-6">
                <MapPin className="h-5 w-5 mr-2 shrink-0 text-primary" />
                <span>{property.location}</span>
              </div>

              <div className="flex flex-wrap gap-4 sm:gap-6">
                {property.bedrooms && (
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2.5">
                    <Bed className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm">{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2.5">
                    <Bath className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm">{property.bathrooms} Bathrooms</span>
                  </div>
                )}
                {property.size && (
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2.5">
                    <Maximize className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm">{property.size.toLocaleString()} sqft</span>
                  </div>
                )}
              </div>
            </div>

            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-2 h-11">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features & Amenities</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <Card className="p-6 sm:p-8 border-border/60 shadow-sm">
                  <h3 className="text-xl font-heading font-semibold mb-4">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </Card>
              </TabsContent>
              <TabsContent value="features" className="mt-6">
                <Card className="p-6 sm:p-8 border-border/60 shadow-sm">
                  <h3 className="text-xl font-heading font-semibold mb-4">
                    Features & Amenities
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </TabsContent>
            </Tabs>

            <VirtualTour
              propertyType={property.propertyType}
              location={property.location}
              title={property.title}
              latitude={lat}
              longitude={lng}
            />

            <section>
              <h2 className="text-2xl font-heading font-semibold mb-4">Location</h2>
              <div className="z-0 rounded-xl overflow-hidden ring-1 ring-border/50 shadow-sm">
                <MapLocation
                  title={property.title}
                  lat={lat}
                  lng={lng}
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:sticky-below-nav h-fit space-y-5">
            <Card className="overflow-hidden border-primary/15 shadow-lg">
              <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              <div className="p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Price
                </p>
                <CurrencyConverter
                  priceAED={propertyPrice}
                  className="flex-col sm:flex-row items-start sm:items-center gap-3 mb-6"
                  priceClassName="text-3xl sm:text-4xl font-heading font-semibold text-primary"
                />

                <div className="space-y-3">
                  <Button
                    className="w-full shadow-md"
                    size="lg"
                    onClick={() =>
                      openViewingBooking({
                        propertyId: property.id,
                        propertyTitle: property.title,
                      })
                    }
                    data-testid="button-schedule-viewing"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule Viewing
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={scrollToMortgageCalculator}
                    data-testid="button-estimate-mortgage"
                  >
                    <Calculator className="mr-2 h-5 w-5" />
                    Estimate Mortgage
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => setLocation("/contact")}
                    data-testid="button-request-info"
                  >
                    Request Information
                  </Button>
                </div>
              </div>
            </Card>

            <MortgageCalculator
              key={property.id}
              defaultPrice={propertyPrice}
              propertyTitle={property.title}
            />

            <Card className="p-6 sm:p-7 border-border/60 shadow-sm">
              <h3 className="text-lg font-heading font-semibold mb-4">Contact Agent</h3>
              <div className="space-y-4">
                <div className="rounded-lg bg-muted/40 px-4 py-3">
                  <p className="font-medium mb-0.5">RealState Properties</p>
                  <p className="text-sm text-muted-foreground">Luxury Property Specialist</p>
                </div>
                <div className="space-y-2.5">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                    data-testid="button-call"
                  >
                    <a href={`tel:${contactInfo.phoneTel}`}>
                      <Phone className="mr-2 h-4 w-4 text-primary" />
                      {contactInfo.phoneDisplay}
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                    data-testid="button-email"
                  >
                    <a href={`mailto:${contactInfo.emails.info}`}>
                      <Mail className="mr-2 h-4 w-4 text-primary" />
                      {contactInfo.emails.info}
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
