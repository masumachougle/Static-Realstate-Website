import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, Pencil, Trash2, Search, Filter, LayoutGrid, List, 
  Building2, DollarSign, MoreHorizontal,
  Download, RefreshCw, MapPin, Bed, Bath, 
  Maximize, Star, CheckCircle2, XCircle, Clock, ArrowUpDown,
  Home, Building, Castle, Store, ExternalLink, Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

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
}

type ViewMode = "table" | "grid";
type SortField = "title" | "price" | "location" | "status" | "propertyType";
type SortDirection = "asc" | "desc";

export default function AdminProperties() {
  const [, navigate] = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: properties, isLoading, refetch } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/properties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Property Deleted",
        description: "The property has been permanently removed from the system.",
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(id => apiRequest("DELETE", `/api/properties/${id}`)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      setSelectedProperties([]);
      toast({
        title: "Bulk Delete Complete",
        description: `${selectedProperties.length} properties have been removed.`,
      });
    },
  });

  const filteredAndSortedProperties = useMemo(() => {
    if (!properties) return [];

    let filtered = properties.filter((property) => {
      const matchesSearch = 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || property.status === statusFilter;
      const matchesType = typeFilter === "all" || property.propertyType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "price":
          comparison = Number(a.price) - Number(b.price);
          break;
        case "location":
          comparison = a.location.localeCompare(b.location);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "propertyType":
          comparison = a.propertyType.localeCompare(b.propertyType);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [properties, searchQuery, statusFilter, typeFilter, sortField, sortDirection]);

  const stats = useMemo(() => {
    if (!properties) return { total: 0, available: 0, sold: 0, reserved: 0, totalValue: 0, featured: 0 };
    
    return {
      total: properties.length,
      available: properties.filter(p => p.status === "available").length,
      sold: properties.filter(p => p.status === "sold").length,
      reserved: properties.filter(p => p.status === "reserved").length,
      totalValue: properties.reduce((sum, p) => sum + Number(p.price), 0),
      featured: properties.filter(p => p.featured === "true").length,
    };
  }, [properties]);

  const handleEdit = (property: Property) => {
    navigate(`/admin/properties/${property.id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedProperties.length} properties? This action cannot be undone.`)) {
      bulkDeleteMutation.mutate(selectedProperties);
    }
  };

  const handleCreateNew = () => {
    navigate("/admin/properties/new");
  };

  const toggleSelectAll = () => {
    if (selectedProperties.length === filteredAndSortedProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(filteredAndSortedProperties.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedProperties(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "villa": return <Castle className="h-4 w-4" />;
      case "apartment": return <Building className="h-4 w-4" />;
      case "penthouse": return <Building2 className="h-4 w-4" />;
      case "townhouse": return <Home className="h-4 w-4" />;
      case "commercial": return <Store className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Available
          </Badge>
        );
      case "sold":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Sold
          </Badge>
        );
      case "reserved":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Reserved
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const exportToCSV = () => {
    if (!properties) return;
    
    const headers = ["ID", "Title", "Type", "Location", "Price (AED)", "Bedrooms", "Bathrooms", "Size (sq ft)", "Status", "Featured"];
    const csvContent = [
      headers.join(","),
      ...properties.map(p => [
        p.id,
        `"${p.title}"`,
        p.propertyType,
        `"${p.location}"`,
        p.price,
        p.bedrooms || "",
        p.bathrooms || "",
        p.size || "",
        p.status,
        p.featured
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `properties_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    
    toast({
      title: "Export Complete",
      description: `${properties.length} properties exported to CSV.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1800px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Property Management</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                  Manage and monitor all property listings across your portfolio
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => refetch()} data-testid="button-refresh">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV} data-testid="button-export">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleCreateNew} data-testid="button-add-property">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Properties</p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Available</p>
                  <p className="text-2xl font-bold mt-1 text-emerald-600">{stats.available}</p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sold</p>
                  <p className="text-2xl font-bold mt-1 text-red-600">{stats.sold}</p>
                </div>
                <div className="p-2 rounded-lg bg-red-500/10">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reserved</p>
                  <p className="text-2xl font-bold mt-1 text-amber-600">{stats.reserved}</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-violet-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Featured</p>
                  <p className="text-2xl font-bold mt-1 text-violet-600">{stats.featured}</p>
                </div>
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <Star className="h-5 w-5 text-violet-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Portfolio Value</p>
                  <p className="text-lg font-bold mt-1 text-blue-600">
                    {(stats.totalValue / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search properties by title, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[160px]" data-testid="select-status-filter">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[160px]" data-testid="select-type-filter">
                    <Building2 className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                {selectedProperties.length > 0 && (
                  <div className="flex items-center gap-2 mr-2">
                    <span className="text-sm text-muted-foreground">
                      {selectedProperties.length} selected
                    </span>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleBulkDelete}
                      data-testid="button-bulk-delete"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
                <Separator orientation="vertical" className="h-8 hidden lg:block" />
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                  <TabsList className="h-9">
                    <TabsTrigger value="table" className="px-3" data-testid="button-view-table">
                      <List className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="grid" className="px-3" data-testid="button-view-grid">
                      <LayoutGrid className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {isLoading ? (
          <Card>
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading properties...</p>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === "table" ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedProperties.length === filteredAndSortedProperties.length && filteredAndSortedProperties.length > 0}
                        onCheckedChange={toggleSelectAll}
                        data-testid="checkbox-select-all"
                      />
                    </TableHead>
                    <TableHead className="min-w-[250px]">
                      <Button 
                        variant="ghost" 
                        className="h-8 px-2 -ml-2 font-semibold"
                        onClick={() => handleSort("title")}
                      >
                        Property
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="h-8 px-2 -ml-2 font-semibold"
                        onClick={() => handleSort("propertyType")}
                      >
                        Type
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="h-8 px-2 -ml-2 font-semibold"
                        onClick={() => handleSort("location")}
                      >
                        Location
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button 
                        variant="ghost" 
                        className="h-8 px-2 -ml-2 font-semibold"
                        onClick={() => handleSort("price")}
                      >
                        Price
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center">Details</TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="h-8 px-2 -ml-2 font-semibold"
                        onClick={() => handleSort("status")}
                      >
                        Status
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedProperties.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Building2 className="h-8 w-8 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No properties found</p>
                          <Button variant="outline" size="sm" onClick={handleCreateNew}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add your first property
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedProperties.map((property) => (
                      <TableRow 
                        key={property.id} 
                        className="group hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleEdit(property)}
                        data-testid={`row-property-${property.id}`}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox 
                            checked={selectedProperties.includes(property.id)}
                            onCheckedChange={() => toggleSelect(property.id)}
                            data-testid={`checkbox-property-${property.id}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                              {getPropertyTypeIcon(property.propertyType)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">{property.title}</p>
                                {property.featured === "true" && (
                                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {property.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getPropertyTypeIcon(property.propertyType)}
                            <span className="text-sm">{property.propertyType}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{property.location}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p className="font-semibold">AED {Number(property.price).toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">
                              ${(Number(property.price) / 3.67).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                            {property.bedrooms && (
                              <div className="flex items-center gap-1" title="Bedrooms">
                                <Bed className="h-3.5 w-3.5" />
                                <span>{property.bedrooms}</span>
                              </div>
                            )}
                            {property.bathrooms && (
                              <div className="flex items-center gap-1" title="Bathrooms">
                                <Bath className="h-3.5 w-3.5" />
                                <span>{property.bathrooms}</span>
                              </div>
                            )}
                            {property.size && (
                              <div className="flex items-center gap-1" title="Size">
                                <Maximize className="h-3.5 w-3.5" />
                                <span>{property.size.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(property.status)}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(property)}
                              data-testid={`button-edit-${property.id}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleEdit(property)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit Property
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open(`/property/${property.id}`, '_blank')}>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View Live
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  navigator.clipboard.writeText(property.id);
                                  toast({ title: "Copied", description: "Property ID copied to clipboard" });
                                }}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy ID
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDelete(property.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            {filteredAndSortedProperties.length > 0 && (
              <div className="px-4 py-3 border-t bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredAndSortedProperties.length} of {properties?.length || 0} properties
                </p>
              </div>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedProperties.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="p-12">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Building2 className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No properties found</p>
                    <Button variant="outline" onClick={handleCreateNew}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add your first property
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredAndSortedProperties.map((property) => (
                <Card 
                  key={property.id} 
                  className="overflow-hidden hover-elevate transition-all duration-300 group cursor-pointer"
                  onClick={() => handleEdit(property)}
                  data-testid={`card-property-${property.id}`}
                >
                  <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <div className="absolute top-3 left-3 z-10" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedProperties.includes(property.id)}
                        onCheckedChange={() => toggleSelect(property.id)}
                        className="bg-background"
                      />
                    </div>
                    <div className="absolute top-3 right-3 z-10 flex gap-2">
                      {property.featured === "true" && (
                        <Badge className="bg-amber-500 text-white">
                          <Star className="h-3 w-3 mr-1 fill-white" />
                          Featured
                        </Badge>
                      )}
                      {getStatusBadge(property.status)}
                    </div>
                    <div className="p-6 rounded-2xl bg-background/80 backdrop-blur">
                      {getPropertyTypeIcon(property.propertyType)}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-lg leading-tight line-clamp-1">
                            {property.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground text-sm">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{property.location}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {property.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm">
                        {property.bedrooms && (
                          <div className="flex items-center gap-1.5">
                            <Bed className="h-4 w-4 text-muted-foreground" />
                            <span>{property.bedrooms} Beds</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center gap-1.5">
                            <Bath className="h-4 w-4 text-muted-foreground" />
                            <span>{property.bathrooms} Baths</span>
                          </div>
                        )}
                        {property.size && (
                          <div className="flex items-center gap-1.5">
                            <Maximize className="h-4 w-4 text-muted-foreground" />
                            <span>{property.size.toLocaleString()} sqft</span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-bold">
                            AED {Number(property.price).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ${(Number(property.price) / 3.67).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                          </p>
                        </div>
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => handleEdit(property)}
                            data-testid={`button-edit-${property.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => window.open(`/property/${property.id}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon" className="h-9 w-9">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                navigator.clipboard.writeText(property.id);
                                toast({ title: "Copied", description: "Property ID copied to clipboard" });
                              }}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy ID
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(property.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
