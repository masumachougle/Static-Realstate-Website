import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Save, Trash2, Eye, Building2, MapPin, DollarSign,
  Bed, Bath, Maximize, Calendar, Car, Layers, Mountain, Sofa,
  FileText, Link as LinkIcon, Video, Image, Star, CheckCircle2,
  XCircle, Clock, RefreshCw, ExternalLink, Copy, Home, Building, Castle, Store
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  propertyType: string;
  location: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size: number | null;
  images: string[];
  featured: string;
  status: string;
  amenities: string[] | null;
  referenceNumber: string | null;
  virtualTourUrl: string | null;
  videoUrl: string | null;
  yearBuilt: number | null;
  parkingSpaces: number | null;
  floorNumber: number | null;
  totalFloors: number | null;
  viewType: string | null;
  furnishing: string | null;
  ownership: string | null;
  serviceCharge: string | null;
  developer: string | null;
  projectName: string | null;
  handoverDate: string | null;
  roi: string | null;
  pricePerSqft: string | null;
  plotSize: number | null;
  agentNotes: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

const propertyTypes = [
  "Apartment", "Villa", "Penthouse", "Townhouse", "Duplex", 
  "Studio", "Loft", "Commercial", "Office Space", "Retail Space", "Land/Plot"
];

const viewTypes = [
  "Sea", "Marina", "City", "Garden", "Pool", "Golf Course", 
  "Burj Khalifa", "Palm", "Canal", "Landmark"
];

const furnishingOptions = ["Furnished", "Unfurnished", "Semi-Furnished"];
const ownershipOptions = ["Freehold", "Leasehold"];

const defaultAmenities = [
  "Swimming Pool", "Gym", "Parking", "Security", "Balcony", "Garden",
  "Maid's Room", "Study Room", "Storage", "Concierge", "Spa", "Sauna",
  "Kids Play Area", "BBQ Area", "Jacuzzi", "Private Pool", "Beach Access"
];

export default function AdminPropertyDetail() {
  const [, params] = useRoute("/admin/properties/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const isNew = params?.id === "new";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    propertyType: "Apartment",
    location: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    images: "",
    featured: "false",
    status: "available",
    amenities: [] as string[],
    referenceNumber: "",
    virtualTourUrl: "",
    videoUrl: "",
    yearBuilt: "",
    parkingSpaces: "",
    floorNumber: "",
    totalFloors: "",
    viewType: "",
    furnishing: "",
    ownership: "",
    serviceCharge: "",
    developer: "",
    projectName: "",
    handoverDate: "",
    roi: "",
    pricePerSqft: "",
    plotSize: "",
    agentNotes: "",
    metaTitle: "",
    metaDescription: "",
  });

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ["/api/properties", params?.id],
    enabled: !isNew && !!params?.id,
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        description: property.description || "",
        price: property.price || "",
        propertyType: property.propertyType || "Apartment",
        location: property.location || "",
        bedrooms: property.bedrooms?.toString() || "",
        bathrooms: property.bathrooms?.toString() || "",
        size: property.size?.toString() || "",
        images: property.images?.join(", ") || "",
        featured: property.featured || "false",
        status: property.status || "available",
        amenities: property.amenities || [],
        referenceNumber: property.referenceNumber || "",
        virtualTourUrl: property.virtualTourUrl || "",
        videoUrl: property.videoUrl || "",
        yearBuilt: property.yearBuilt?.toString() || "",
        parkingSpaces: property.parkingSpaces?.toString() || "",
        floorNumber: property.floorNumber?.toString() || "",
        totalFloors: property.totalFloors?.toString() || "",
        viewType: property.viewType || "",
        furnishing: property.furnishing || "",
        ownership: property.ownership || "",
        serviceCharge: property.serviceCharge || "",
        developer: property.developer || "",
        projectName: property.projectName || "",
        handoverDate: property.handoverDate || "",
        roi: property.roi || "",
        pricePerSqft: property.pricePerSqft || "",
        plotSize: property.plotSize?.toString() || "",
        agentNotes: property.agentNotes || "",
        metaTitle: property.metaTitle || "",
        metaDescription: property.metaDescription || "",
      });
    }
  }, [property]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
        size: data.size ? parseInt(data.size) : null,
        images: data.images ? data.images.split(",").map(s => s.trim()).filter(Boolean) : [],
        yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt) : null,
        parkingSpaces: data.parkingSpaces ? parseInt(data.parkingSpaces) : null,
        floorNumber: data.floorNumber ? parseInt(data.floorNumber) : null,
        totalFloors: data.totalFloors ? parseInt(data.totalFloors) : null,
        plotSize: data.plotSize ? parseInt(data.plotSize) : null,
      };

      if (isNew) {
        return apiRequest("POST", "/api/properties", payload);
      } else {
        return apiRequest("PUT", `/api/properties/${params?.id}`, payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: isNew ? "Property Created" : "Property Updated",
        description: isNew 
          ? "The new property has been added to your listings."
          : "Your changes have been saved successfully.",
      });
      navigate("/admin/properties");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save property",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/properties/${params?.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Property Deleted",
        description: "The property has been permanently removed.",
      });
      navigate("/admin/properties");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Title, Price, Location)",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"><CheckCircle2 className="h-3 w-3 mr-1" />Available</Badge>;
      case "sold":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20"><XCircle className="h-3 w-3 mr-1" />Sold</Badge>;
      case "reserved":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20"><Clock className="h-3 w-3 mr-1" />Reserved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "villa": return <Castle className="h-5 w-5" />;
      case "apartment": return <Building className="h-5 w-5" />;
      case "penthouse": return <Building2 className="h-5 w-5" />;
      case "townhouse": return <Home className="h-5 w-5" />;
      case "commercial": return <Store className="h-5 w-5" />;
      default: return <Home className="h-5 w-5" />;
    }
  };

  if (isLoading && !isNew) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/properties")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                {getPropertyTypeIcon(formData.propertyType)}
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {isNew ? "Add New Property" : formData.title || "Property Details"}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  {!isNew && property && (
                    <>
                      {getStatusBadge(formData.status)}
                      {formData.featured === "true" && (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                          <Star className="h-3 w-3 mr-1 fill-amber-500" />
                          Featured
                        </Badge>
                      )}
                      {formData.referenceNumber && (
                        <Badge variant="outline" className="text-xs">
                          #{formData.referenceNumber}
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isNew && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/property/${params?.id}`, "_blank")}
                  data-testid="button-preview"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={handleDelete}
                  data-testid="button-delete"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
            <Button
              onClick={handleSubmit}
              disabled={saveMutation.isPending}
              data-testid="button-save"
            >
              {saveMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isNew ? "Create Property" : "Save Changes"}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="basic" className="data-[state=active]:bg-background">
                <FileText className="h-4 w-4 mr-2" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-background">
                <Building2 className="h-4 w-4 mr-2" />
                Property Details
              </TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-background">
                <Star className="h-4 w-4 mr-2" />
                Features & Amenities
              </TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-background">
                <Image className="h-4 w-4 mr-2" />
                Media
              </TabsTrigger>
              <TabsTrigger value="financial" className="data-[state=active]:bg-background">
                <DollarSign className="h-4 w-4 mr-2" />
                Financial
              </TabsTrigger>
              <TabsTrigger value="seo" className="data-[state=active]:bg-background">
                <LinkIcon className="h-4 w-4 mr-2" />
                SEO
              </TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Property Information</CardTitle>
                    <CardDescription>Basic details about the property listing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="title">Property Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Luxury Beachfront Villa"
                          data-testid="input-title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="referenceNumber">Reference Number</Label>
                        <Input
                          id="referenceNumber"
                          value={formData.referenceNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, referenceNumber: e.target.value }))}
                          placeholder="e.g., KS-2024-001"
                          data-testid="input-reference"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="propertyType">Property Type</Label>
                        <Select
                          value={formData.propertyType}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}
                        >
                          <SelectTrigger data-testid="select-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {propertyTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the property in detail..."
                        rows={6}
                        data-testid="input-description"
                      />
                      <p className="text-xs text-muted-foreground">{formData.description.length} characters</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="e.g., Palm Jumeirah, Dubai"
                            className="pl-10"
                            data-testid="input-location"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (AED) *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                            placeholder="e.g., 5000000"
                            className="pl-10"
                            data-testid="input-price"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Status & Visibility</CardTitle>
                    <CardDescription>Control how this property appears</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Listing Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger data-testid="select-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              Available
                            </div>
                          </SelectItem>
                          <SelectItem value="sold">
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-500" />
                              Sold
                            </div>
                          </SelectItem>
                          <SelectItem value="reserved">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-amber-500" />
                              Reserved
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Featured Property</Label>
                        <p className="text-xs text-muted-foreground">Show on homepage</p>
                      </div>
                      <Switch
                        checked={formData.featured === "true"}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked ? "true" : "false" }))}
                        data-testid="switch-featured"
                      />
                    </div>
                    {!isNew && property?.createdAt && (
                      <>
                        <Separator />
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Created</span>
                            <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                          </div>
                          {property.updatedAt && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Updated</span>
                              <span>{new Date(property.updatedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Property Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                    <CardDescription>Property size and room details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <div className="relative">
                          <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="bedrooms"
                            type="number"
                            value={formData.bedrooms}
                            onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                            placeholder="0"
                            className="pl-10"
                            data-testid="input-bedrooms"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <div className="relative">
                          <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="bathrooms"
                            type="number"
                            value={formData.bathrooms}
                            onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                            placeholder="0"
                            className="pl-10"
                            data-testid="input-bathrooms"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="size">Size (sq ft)</Label>
                        <div className="relative">
                          <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="size"
                            type="number"
                            value={formData.size}
                            onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                            placeholder="0"
                            className="pl-10"
                            data-testid="input-size"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="plotSize">Plot Size (sq ft)</Label>
                        <Input
                          id="plotSize"
                          type="number"
                          value={formData.plotSize}
                          onChange={(e) => setFormData(prev => ({ ...prev, plotSize: e.target.value }))}
                          placeholder="0"
                          data-testid="input-plot-size"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parkingSpaces">Parking Spaces</Label>
                        <div className="relative">
                          <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="parkingSpaces"
                            type="number"
                            value={formData.parkingSpaces}
                            onChange={(e) => setFormData(prev => ({ ...prev, parkingSpaces: e.target.value }))}
                            placeholder="0"
                            className="pl-10"
                            data-testid="input-parking"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearBuilt">Year Built</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="yearBuilt"
                            type="number"
                            value={formData.yearBuilt}
                            onChange={(e) => setFormData(prev => ({ ...prev, yearBuilt: e.target.value }))}
                            placeholder="e.g., 2023"
                            className="pl-10"
                            data-testid="input-year-built"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Building Information</CardTitle>
                    <CardDescription>Floor and building details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="floorNumber">Floor Number</Label>
                        <div className="relative">
                          <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="floorNumber"
                            type="number"
                            value={formData.floorNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, floorNumber: e.target.value }))}
                            placeholder="0"
                            className="pl-10"
                            data-testid="input-floor"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalFloors">Total Floors</Label>
                        <Input
                          id="totalFloors"
                          type="number"
                          value={formData.totalFloors}
                          onChange={(e) => setFormData(prev => ({ ...prev, totalFloors: e.target.value }))}
                          placeholder="0"
                          data-testid="input-total-floors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>View Type</Label>
                      <Select
                        value={formData.viewType}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, viewType: value }))}
                      >
                        <SelectTrigger data-testid="select-view-type">
                          <Mountain className="h-4 w-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Select view type" />
                        </SelectTrigger>
                        <SelectContent>
                          {viewTypes.map(view => (
                            <SelectItem key={view} value={view}>{view}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Furnishing</Label>
                      <Select
                        value={formData.furnishing}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, furnishing: value }))}
                      >
                        <SelectTrigger data-testid="select-furnishing">
                          <Sofa className="h-4 w-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Select furnishing" />
                        </SelectTrigger>
                        <SelectContent>
                          {furnishingOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Ownership Type</Label>
                      <Select
                        value={formData.ownership}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, ownership: value }))}
                      >
                        <SelectTrigger data-testid="select-ownership">
                          <SelectValue placeholder="Select ownership" />
                        </SelectTrigger>
                        <SelectContent>
                          {ownershipOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Developer Information</CardTitle>
                    <CardDescription>Project and developer details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="developer">Developer</Label>
                        <Input
                          id="developer"
                          value={formData.developer}
                          onChange={(e) => setFormData(prev => ({ ...prev, developer: e.target.value }))}
                          placeholder="e.g., Emaar Properties"
                          data-testid="input-developer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="projectName">Project Name</Label>
                        <Input
                          id="projectName"
                          value={formData.projectName}
                          onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                          placeholder="e.g., Marina Vista"
                          data-testid="input-project"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="handoverDate">Handover Date</Label>
                        <Input
                          id="handoverDate"
                          value={formData.handoverDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, handoverDate: e.target.value }))}
                          placeholder="e.g., Q4 2025"
                          data-testid="input-handover"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Features & Amenities Tab */}
            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                  <CardDescription>Select all amenities available in this property</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {defaultAmenities.map(amenity => (
                      <div
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.amenities.includes(amenity)
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-muted/50 border-transparent hover:border-muted-foreground/20"
                        }`}
                        data-testid={`amenity-${amenity.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      >
                        <div className={`h-4 w-4 rounded-sm border flex items-center justify-center ${
                          formData.amenities.includes(amenity)
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/30"
                        }`}>
                          {formData.amenities.includes(amenity) && (
                            <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    {formData.amenities.length} amenities selected
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Agent Notes</CardTitle>
                  <CardDescription>Internal notes (not visible to public)</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.agentNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, agentNotes: e.target.value }))}
                    placeholder="Add any internal notes about this property..."
                    rows={4}
                    data-testid="input-agent-notes"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Images</CardTitle>
                  <CardDescription>Add image URLs separated by commas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={formData.images}
                    onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    rows={4}
                    data-testid="input-images"
                  />
                  {formData.images && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.split(",").map((url, index) => {
                        const trimmedUrl = url.trim();
                        if (!trimmedUrl) return null;
                        return (
                          <div key={index} className="aspect-video rounded-lg bg-muted overflow-hidden">
                            <img 
                              src={trimmedUrl} 
                              alt={`Property image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Virtual Tour
                    </CardTitle>
                    <CardDescription>360° tour URL (Matterport, etc.)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      value={formData.virtualTourUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, virtualTourUrl: e.target.value }))}
                      placeholder="https://my.matterport.com/show/?m=..."
                      data-testid="input-virtual-tour"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Video URL
                    </CardTitle>
                    <CardDescription>YouTube or Vimeo video URL</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      value={formData.videoUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=..."
                      data-testid="input-video"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Details</CardTitle>
                    <CardDescription>Price breakdown and financial information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pricePerSqft">Price per sq ft (AED)</Label>
                      <Input
                        id="pricePerSqft"
                        value={formData.pricePerSqft}
                        onChange={(e) => setFormData(prev => ({ ...prev, pricePerSqft: e.target.value }))}
                        placeholder="e.g., 2500"
                        data-testid="input-price-sqft"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceCharge">Service Charge (AED/year)</Label>
                      <Input
                        id="serviceCharge"
                        value={formData.serviceCharge}
                        onChange={(e) => setFormData(prev => ({ ...prev, serviceCharge: e.target.value }))}
                        placeholder="e.g., 15000"
                        data-testid="input-service-charge"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Investment Details</CardTitle>
                    <CardDescription>ROI and investment information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="roi">Expected ROI (%)</Label>
                      <Input
                        id="roi"
                        value={formData.roi}
                        onChange={(e) => setFormData(prev => ({ ...prev, roi: e.target.value }))}
                        placeholder="e.g., 7.5"
                        data-testid="input-roi"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>Optimize this property for search engines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                      placeholder="e.g., Luxury 5BR Villa in Palm Jumeirah | RealState Properties"
                      data-testid="input-meta-title"
                    />
                    <p className="text-xs text-muted-foreground">{formData.metaTitle.length}/60 characters recommended</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                      placeholder="e.g., Discover this stunning 5-bedroom villa with private beach access..."
                      rows={3}
                      data-testid="input-meta-description"
                    />
                    <p className="text-xs text-muted-foreground">{formData.metaDescription.length}/160 characters recommended</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  );
}
