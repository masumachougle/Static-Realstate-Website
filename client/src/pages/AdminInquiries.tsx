import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Mail, Phone, Calendar, Search, MessageSquare, Users, Clock, 
  TrendingUp, MoreHorizontal, Eye, Trash2, Download, RefreshCw,
  LayoutGrid, List, ArrowUpDown, Copy, ExternalLink, Building2,
  CheckCircle2, XCircle, AlertCircle, Star, StarOff, Filter,
  ChevronRight, Send, MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyInterest: string | null;
  message: string;
  propertyId: string | null;
  propertyTitle: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  notes: string | null;
  createdAt: string;
}

const INTEREST_LABELS: Record<string, string> = {
  viewing: "Property Viewing",
  buying: "Buying Property",
  selling: "Selling Property",
  renting: "Renting",
  investment: "Investment Consulting",
  management: "Property Management",
};

function formatInterestLabel(interest: string | null) {
  if (!interest) return "General Inquiry";
  return INTEREST_LABELS[interest] ?? interest;
}

function formatPreferredDate(date: string | null) {
  if (!date) return null;
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPreferredTime(time: string | null) {
  if (!time) return null;
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

function isViewingInquiry(contact: Contact) {
  return contact.propertyInterest === "viewing";
}

type ViewMode = "table" | "grid";
type SortField = "name" | "date" | "propertyInterest";
type SortDirection = "asc" | "desc";
type StatusFilter = "all" | "new" | "read" | "starred";

export default function AdminInquiries() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([]);
  const [viewingInquiry, setViewingInquiry] = useState<Contact | null>(null);
  const [readInquiries, setReadInquiries] = useState<string[]>([]);
  const [starredInquiries, setStarredInquiries] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { toast } = useToast();

  const { data: contacts, isLoading, refetch } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const uniqueProperties = useMemo(() => {
    if (!contacts) return [];
    const props = contacts.map(c => c.propertyInterest).filter(Boolean) as string[];
    return Array.from(new Set(props));
  }, [contacts]);

  const filteredAndSortedContacts = useMemo(() => {
    if (!contacts) return [];

    let filtered = contacts.filter((contact) => {
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery) ||
        contact.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesProperty = propertyFilter === "all" || contact.propertyInterest === propertyFilter;
      
      let matchesStatus = true;
      if (statusFilter === "new") {
        matchesStatus = !readInquiries.includes(contact.id);
      } else if (statusFilter === "read") {
        matchesStatus = readInquiries.includes(contact.id);
      } else if (statusFilter === "starred") {
        matchesStatus = starredInquiries.includes(contact.id);
      }

      return matchesSearch && matchesProperty && matchesStatus;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "date":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "propertyInterest":
          comparison = (a.propertyInterest || "").localeCompare(b.propertyInterest || "");
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [contacts, searchQuery, propertyFilter, sortField, sortDirection, statusFilter, readInquiries, starredInquiries]);

  const stats = useMemo(() => {
    if (!contacts) return { total: 0, today: 0, thisWeek: 0, unread: 0 };
    
    const now = new Date();
    const today = contacts.filter(c => {
      const date = new Date(c.createdAt);
      return date.toDateString() === now.toDateString();
    }).length;

    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = contacts.filter(c => new Date(c.createdAt) >= weekAgo).length;

    const unread = contacts.filter(c => !readInquiries.includes(c.id)).length;

    return {
      total: contacts.length,
      today,
      thisWeek,
      unread,
    };
  }, [contacts, readInquiries]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleSelectAll = () => {
    if (selectedInquiries.length === filteredAndSortedContacts.length) {
      setSelectedInquiries([]);
    } else {
      setSelectedInquiries(filteredAndSortedContacts.map(c => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedInquiries(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleRead = (id: string) => {
    setReadInquiries(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleStarred = (id: string) => {
    setStarredInquiries(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const markAllAsRead = () => {
    setReadInquiries(contacts?.map(c => c.id) || []);
    toast({
      title: "All Marked as Read",
      description: "All inquiries have been marked as read.",
    });
  };

  const viewInquiry = (contact: Contact) => {
    setViewingInquiry(contact);
    if (!readInquiries.includes(contact.id)) {
      setReadInquiries(prev => [...prev, contact.id]);
    }
  };

  const exportToCSV = () => {
    if (!contacts) return;
    
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Property Interest",
      "Property",
      "Preferred Date",
      "Preferred Time",
      "Notes",
      "Message",
      "Date",
    ];
    const csvContent = [
      headers.join(","),
      ...contacts.map(c => [
        `"${c.name.replace(/"/g, '""')}"`,
        c.email,
        c.phone,
        `"${formatInterestLabel(c.propertyInterest).replace(/"/g, '""')}"`,
        `"${(c.propertyTitle || "N/A").replace(/"/g, '""')}"`,
        `"${(c.preferredDate || "N/A").replace(/"/g, '""')}"`,
        `"${(formatPreferredTime(c.preferredTime) || "N/A").replace(/"/g, '""')}"`,
        `"${(c.notes || "N/A").replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${c.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        new Date(c.createdAt).toISOString()
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inquiries_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    
    toast({
      title: "Export Complete",
      description: `${contacts.length} inquiries exported to CSV.`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1800px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Customer Inquiries</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                  Manage and respond to customer messages
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetch()} data-testid="button-refresh">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV} data-testid="button-export">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Inquiries</p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-rose-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Unread</p>
                  <p className="text-2xl font-bold mt-1 text-rose-600">{stats.unread}</p>
                </div>
                <div className="p-2 rounded-lg bg-rose-500/10">
                  <AlertCircle className="h-5 w-5 text-rose-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Today</p>
                  <p className="text-2xl font-bold mt-1 text-emerald-600">{stats.today}</p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Clock className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-violet-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">This Week</p>
                  <p className="text-2xl font-bold mt-1 text-violet-600">{stats.thisWeek}</p>
                </div>
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <TrendingUp className="h-5 w-5 text-violet-500" />
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
                    placeholder="Search by name, email, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                  <SelectTrigger className="w-full sm:w-[150px]" data-testid="select-status-filter">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Messages</SelectItem>
                    <SelectItem value="new">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="starred">Starred</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-property-filter">
                    <Building2 className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Property Interest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    {uniqueProperties.map(prop => (
                      <SelectItem key={prop} value={prop!}>{prop}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                {selectedInquiries.length > 0 && (
                  <div className="flex items-center gap-2 mr-2">
                    <span className="text-sm text-muted-foreground">
                      {selectedInquiries.length} selected
                    </span>
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
                <p className="text-muted-foreground">Loading inquiries...</p>
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
                        checked={selectedInquiries.length === filteredAndSortedContacts.length && filteredAndSortedContacts.length > 0}
                        onCheckedChange={toggleSelectAll}
                        data-testid="checkbox-select-all"
                      />
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="min-w-[200px]">
                      <Button 
                        variant="ghost" 
                        className="h-8 px-2 -ml-2 font-semibold"
                        onClick={() => handleSort("name")}
                      >
                        Customer
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="h-8 px-2 -ml-2 font-semibold"
                        onClick={() => handleSort("propertyInterest")}
                      >
                        Property Interest
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Viewing Details</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="h-8 px-2 -ml-2 font-semibold"
                        onClick={() => handleSort("date")}
                      >
                        Date
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedContacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No inquiries found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedContacts.map((contact) => (
                      <TableRow 
                        key={contact.id} 
                        className={cn(
                          "group hover:bg-muted/50 cursor-pointer",
                          !readInquiries.includes(contact.id) && "bg-primary/5"
                        )}
                        data-testid={`row-inquiry-${contact.id}`}
                        onClick={() => viewInquiry(contact)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox 
                            checked={selectedInquiries.includes(contact.id)}
                            onCheckedChange={() => toggleSelect(contact.id)}
                            data-testid={`checkbox-inquiry-${contact.id}`}
                          />
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleStarred(contact.id)}
                          >
                            {starredInquiries.includes(contact.id) ? (
                              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            ) : (
                              <StarOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-semibold">
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{contact.name}</p>
                                {!readInquiries.includes(contact.id) && (
                                  <Badge className="bg-rose-500 text-white text-[10px] px-1.5 py-0">NEW</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{getTimeAgo(contact.createdAt)}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-sm">
                              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="truncate max-w-[150px]">{contact.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Phone className="h-3.5 w-3.5" />
                              <span>{contact.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {contact.propertyInterest ? (
                            <Badge variant="outline" className="font-normal">
                              <Building2 className="h-3 w-3 mr-1" />
                              {formatInterestLabel(contact.propertyInterest)}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">General Inquiry</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {isViewingInquiry(contact) ? (
                            <div className="space-y-1 text-sm">
                              {contact.propertyTitle && (
                                <p className="font-medium line-clamp-1 max-w-[180px]">
                                  {contact.propertyTitle}
                                </p>
                              )}
                              {(contact.preferredDate || contact.preferredTime) && (
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                                  <span className="line-clamp-1">
                                    {[
                                      formatPreferredDate(contact.preferredDate),
                                      formatPreferredTime(contact.preferredTime),
                                    ]
                                      .filter(Boolean)
                                      .join(" · ")}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-muted-foreground line-clamp-2 max-w-[200px]">
                            {contact.message}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{new Date(contact.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          </div>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => viewInquiry(contact)}
                              data-testid={`button-view-${contact.id}`}
                            >
                              <Eye className="h-4 w-4" />
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
                                <DropdownMenuItem onClick={() => viewInquiry(contact)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleRead(contact.id)}>
                                  {readInquiries.includes(contact.id) ? (
                                    <>
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Mark as Unread
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Mark as Read
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleStarred(contact.id)}>
                                  {starredInquiries.includes(contact.id) ? (
                                    <>
                                      <StarOff className="h-4 w-4 mr-2" />
                                      Remove Star
                                    </>
                                  ) : (
                                    <>
                                      <Star className="h-4 w-4 mr-2" />
                                      Add Star
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {
                                  window.location.href = `mailto:${contact.email}`;
                                }}>
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  navigator.clipboard.writeText(contact.email);
                                  toast({ title: "Copied", description: "Email copied to clipboard" });
                                }}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Email
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
            {filteredAndSortedContacts.length > 0 && (
              <div className="px-4 py-3 border-t bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredAndSortedContacts.length} of {contacts?.length || 0} inquiries
                </p>
              </div>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedContacts.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="p-12">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No inquiries found</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredAndSortedContacts.map((contact) => (
                <Card 
                  key={contact.id} 
                  className={cn(
                    "overflow-hidden hover-elevate transition-all duration-300 cursor-pointer",
                    !readInquiries.includes(contact.id) && "ring-2 ring-primary/20"
                  )}
                  data-testid={`card-inquiry-${contact.id}`}
                  onClick={() => viewInquiry(contact)}
                >
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg font-semibold">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{contact.name}</h3>
                              {!readInquiries.includes(contact.id) && (
                                <Badge className="bg-rose-500 text-white text-[10px]">NEW</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{getTimeAgo(contact.createdAt)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => { e.stopPropagation(); toggleStarred(contact.id); }}
                        >
                          {starredInquiries.includes(contact.id) ? (
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          ) : (
                            <StarOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{contact.phone}</span>
                        </div>
                      </div>

                      {contact.propertyInterest && (
                        <Badge variant="outline" className="font-normal">
                          <Building2 className="h-3 w-3 mr-1" />
                          {formatInterestLabel(contact.propertyInterest)}
                        </Badge>
                      )}

                      {isViewingInquiry(contact) && (
                        <div className="rounded-lg border bg-muted/30 p-3 space-y-1.5 text-sm">
                          {contact.propertyTitle && (
                            <p className="font-medium">{contact.propertyTitle}</p>
                          )}
                          {(contact.preferredDate || contact.preferredTime) && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>
                                {[
                                  formatPreferredDate(contact.preferredDate),
                                  formatPreferredTime(contact.preferredTime),
                                ]
                                  .filter(Boolean)
                                  .join(" at ")}
                              </span>
                            </div>
                          )}
                          {contact.notes && (
                            <p className="text-muted-foreground line-clamp-2">{contact.notes}</p>
                          )}
                        </div>
                      )}

                      <Separator />

                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Message</p>
                        <p className="text-sm line-clamp-3">{contact.message}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(contact.createdAt)}</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); viewInquiry(contact); }}>
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* View Inquiry Dialog */}
        <Dialog open={!!viewingInquiry} onOpenChange={() => setViewingInquiry(null)}>
          <DialogContent className="max-w-2xl">
            {viewingInquiry && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl font-semibold">
                      {viewingInquiry.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <DialogTitle className="text-xl">{viewingInquiry.name}</DialogTitle>
                      <DialogDescription className="flex items-center gap-2 mt-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(viewingInquiry.createdAt)}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                      <p className="font-medium">{viewingInquiry.email}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Phone className="h-4 w-4" />
                        Phone
                      </div>
                      <p className="font-medium">{viewingInquiry.phone}</p>
                    </div>
                  </div>

                  {viewingInquiry.propertyInterest && (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Building2 className="h-4 w-4" />
                        Inquiry Type
                      </div>
                      <p className="font-medium">{formatInterestLabel(viewingInquiry.propertyInterest)}</p>
                    </div>
                  )}

                  {isViewingInquiry(viewingInquiry) && (
                    <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Viewing Details
                      </div>
                      {viewingInquiry.propertyTitle && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Property</p>
                          <p className="font-medium">{viewingInquiry.propertyTitle}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        {viewingInquiry.preferredDate && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Preferred Date</p>
                            <p className="font-medium">{formatPreferredDate(viewingInquiry.preferredDate)}</p>
                          </div>
                        )}
                        {viewingInquiry.preferredTime && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Preferred Time</p>
                            <p className="font-medium">{formatPreferredTime(viewingInquiry.preferredTime)}</p>
                          </div>
                        )}
                      </div>
                      {viewingInquiry.notes && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Additional Notes</p>
                          <p className="whitespace-pre-wrap">{viewingInquiry.notes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 rounded-lg border bg-background">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </div>
                    <p className="whitespace-pre-wrap">{viewingInquiry.message}</p>
                  </div>

                  <Separator />

                  <div className="flex gap-3">
                    <Button className="flex-1" onClick={() => window.location.href = `mailto:${viewingInquiry.email}`}>
                      <Send className="h-4 w-4 mr-2" />
                      Reply via Email
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => window.open(`tel:${viewingInquiry.phone}`)}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => toggleStarred(viewingInquiry.id)}
                    >
                      {starredInquiries.includes(viewingInquiry.id) ? (
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
