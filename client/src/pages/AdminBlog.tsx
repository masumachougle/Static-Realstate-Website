import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, Pencil, Trash2, Search, Filter, LayoutGrid, List, 
  FileText, TrendingUp, Eye, MoreHorizontal, Download, RefreshCw, 
  Calendar, User, Tag, ExternalLink, Copy, ArrowUpDown, Clock,
  BookOpen, Sparkles, CheckCircle2, Image, Link2, Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { cn } from "@/lib/utils";
import { BLOG_CATEGORIES } from "@shared/blogCategories";
import { getImageUrl } from "@/lib/imageMap";
import { uploadBlogImage } from "@/lib/blogImages";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
}

type ViewMode = "table" | "grid";
type SortField = "title" | "date" | "category" | "author";
type SortDirection = "asc" | "desc";

const CATEGORIES = [...BLOG_CATEGORIES];

export default function AdminBlog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: posts, isLoading, refetch } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({
        title: "Post Deleted",
        description: "The blog post has been permanently removed.",
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(id => apiRequest("DELETE", `/api/blog/${id}`)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setSelectedPosts([]);
      toast({
        title: "Bulk Delete Complete",
        description: `${selectedPosts.length} posts have been removed.`,
      });
    },
  });

  const uniqueAuthors = useMemo(() => {
    if (!posts) return [];
    return [...new Set(posts.map(p => p.author))];
  }, [posts]);

  const uniqueCategories = useMemo(() => {
    if (!posts) return [];
    return [...new Set(posts.map(p => p.category))];
  }, [posts]);

  const filteredAndSortedPosts = useMemo(() => {
    if (!posts) return [];

    let filtered = posts.filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;
      const matchesAuthor = authorFilter === "all" || post.author === authorFilter;

      return matchesSearch && matchesCategory && matchesAuthor;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "author":
          comparison = a.author.localeCompare(b.author);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [posts, searchQuery, categoryFilter, authorFilter, sortField, sortDirection]);

  const stats = useMemo(() => {
    if (!posts) return { total: 0, categories: 0, authors: 0, thisMonth: 0 };
    
    const now = new Date();
    const thisMonth = posts.filter(p => {
      const postDate = new Date(p.date);
      return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
    }).length;

    return {
      total: posts.length,
      categories: uniqueCategories.length,
      authors: uniqueAuthors.length,
      thisMonth,
    };
  }, [posts, uniqueCategories, uniqueAuthors]);

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedPosts.length} posts? This action cannot be undone.`)) {
      bulkDeleteMutation.mutate(selectedPosts);
    }
  };

  const handleCreateNew = () => {
    setEditingPost(null);
    setIsDialogOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedPosts.length === filteredAndSortedPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredAndSortedPosts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedPosts(prev => 
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

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Market Insights": "bg-blue-500/10 text-blue-600 border-blue-500/20",
      "Investment Tips": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      "Lifestyle": "bg-violet-500/10 text-violet-600 border-violet-500/20",
      "Property Guide": "bg-amber-500/10 text-amber-600 border-amber-500/20",
      "Dubai Living": "bg-rose-500/10 text-rose-600 border-rose-500/20",
      "Legal & Regulations": "bg-orange-500/10 text-orange-600 border-orange-500/20",
      "Industry News": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  const exportToCSV = () => {
    if (!posts) return;
    
    const headers = ["ID", "Title", "Category", "Author", "Date", "Excerpt"];
    const csvContent = [
      headers.join(","),
      ...posts.map(p => [
        p.id,
        `"${p.title.replace(/"/g, '""')}"`,
        p.category,
        p.author,
        p.date,
        `"${p.excerpt.replace(/"/g, '""').substring(0, 100)}..."`
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blog_posts_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    
    toast({
      title: "Export Complete",
      description: `${posts.length} blog posts exported to CSV.`,
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
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Blog Management</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                  Create and manage blog content for your audience
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
            <Button onClick={handleCreateNew} data-testid="button-add-blog">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Posts</p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-violet-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Categories</p>
                  <p className="text-2xl font-bold mt-1 text-violet-600">{stats.categories}</p>
                </div>
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <Tag className="h-5 w-5 text-violet-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Authors</p>
                  <p className="text-2xl font-bold mt-1 text-emerald-600">{stats.authors}</p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <User className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">This Month</p>
                  <p className="text-2xl font-bold mt-1 text-amber-600">{stats.thisMonth}</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Calendar className="h-5 w-5 text-amber-500" />
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
                    placeholder="Search posts by title, content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-category-filter">
                    <Tag className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={authorFilter} onValueChange={setAuthorFilter}>
                  <SelectTrigger className="w-full sm:w-[160px]" data-testid="select-author-filter">
                    <User className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Author" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Authors</SelectItem>
                    {uniqueAuthors.map(author => (
                      <SelectItem key={author} value={author}>{author}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                {selectedPosts.length > 0 && (
                  <div className="flex items-center gap-2 mr-2">
                    <span className="text-sm text-muted-foreground">
                      {selectedPosts.length} selected
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
                <p className="text-muted-foreground">Loading blog posts...</p>
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
                        checked={selectedPosts.length === filteredAndSortedPosts.length && filteredAndSortedPosts.length > 0}
                        onCheckedChange={toggleSelectAll}
                        data-testid="checkbox-select-all"
                      />
                    </TableHead>
                    <TableHead className="min-w-[300px]">
                      <Button 
                        variant="ghost" 
                        className="h-8 px-2 -ml-2 font-semibold"
                        onClick={() => handleSort("title")}
                      >
                        Post
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="h-8 px-2 -ml-2 font-semibold"
                        onClick={() => handleSort("category")}
                      >
                        Category
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="h-8 px-2 -ml-2 font-semibold"
                        onClick={() => handleSort("author")}
                      >
                        Author
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
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
                  {filteredAndSortedPosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="h-8 w-8 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No blog posts found</p>
                          <Button variant="outline" size="sm" onClick={handleCreateNew}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create your first post
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedPosts.map((post) => (
                      <TableRow 
                        key={post.id} 
                        className="group hover:bg-muted/50"
                        data-testid={`row-blog-${post.id}`}
                      >
                        <TableCell>
                          <Checkbox 
                            checked={selectedPosts.includes(post.id)}
                            onCheckedChange={() => toggleSelect(post.id)}
                            data-testid={`checkbox-blog-${post.id}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden">
                              {post.image ? (
                                <img src={getImageUrl(post.image)} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <FileText className="h-5 w-5 text-primary/50" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate max-w-[250px]">{post.title}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                                {post.excerpt}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("font-normal", getCategoryColor(post.category))}>
                            {post.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xs font-medium">
                              {post.author.charAt(0)}
                            </div>
                            <span className="text-sm">{post.author}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{post.date}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(post)}
                              data-testid={`button-edit-${post.id}`}
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
                                <DropdownMenuItem onClick={() => handleEdit(post)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit Post
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open(`/blog/${post.id}`, '_blank')}>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View Live
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  navigator.clipboard.writeText(post.id);
                                  toast({ title: "Copied", description: "Post ID copied to clipboard" });
                                }}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy ID
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDelete(post.id)}
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
            {filteredAndSortedPosts.length > 0 && (
              <div className="px-4 py-3 border-t bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredAndSortedPosts.length} of {posts?.length || 0} posts
                </p>
              </div>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedPosts.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="p-12">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <FileText className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No blog posts found</p>
                    <Button variant="outline" onClick={handleCreateNew}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredAndSortedPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="overflow-hidden hover-elevate transition-all duration-300 group"
                  data-testid={`card-blog-${post.id}`}
                >
                  <div className="relative h-40 bg-gradient-to-br from-primary/10 via-primary/5 to-muted flex items-center justify-center">
                    <div className="absolute top-3 left-3 z-10">
                      <Checkbox 
                        checked={selectedPosts.includes(post.id)}
                        onCheckedChange={() => toggleSelect(post.id)}
                        className="bg-background"
                      />
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className={cn("font-normal", getCategoryColor(post.category))}>
                        {post.category}
                      </Badge>
                    </div>
                    {post.image ? (
                      <img src={getImageUrl(post.image)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <FileText className="h-12 w-12 text-primary/30" />
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{post.date}</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{Math.ceil(post.content.split(" ").length / 200)} min read</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(post)}
                            data-testid={`button-edit-${post.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                navigator.clipboard.writeText(post.id);
                                toast({ title: "Copied", description: "Post ID copied to clipboard" });
                              }}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy ID
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(post.id)}
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

        {/* Blog Form Dialog */}
        <BlogFormDialog
          key={editingPost?.id ?? "new"}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          post={editingPost}
        />
      </div>
    </div>
  );
}

function BlogFormDialog({
  open,
  onOpenChange,
  post,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: BlogPost | null;
}) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("content");
  const [uploading, setUploading] = useState<"featured" | "inline" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef<"featured" | "inline">("featured");
  const [formData, setFormData] = useState({
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    category: post?.category || "",
    author: post?.author || "",
    date: post?.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    image: post?.image || "",
  });

  useEffect(() => {
    if (!open) return;
    setFormData({
      title: post?.title || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      category: post?.category || "",
      author: post?.author || "",
      date: post?.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      image: post?.image || "",
    });
  }, [open, post]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (post) {
        await apiRequest("PUT", `/api/blog/${post.id}`, data);
      } else {
        await apiRequest("POST", "/api/blog", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({
        title: post ? "Post Updated" : "Post Created",
        description: post 
          ? "Your blog post has been updated successfully." 
          : "Your new blog post is now live.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      setActiveTab("meta");
      toast({
        title: "Featured image required",
        description: "Upload an image so the post can appear on the website.",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  const openImagePicker = (target: "featured" | "inline") => {
    uploadTarget.current = target;
    fileInputRef.current?.click();
  };

  const handleImageSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const target = uploadTarget.current;
    setUploading(target);
    try {
      const url = await uploadBlogImage(file);
      if (target === "featured") {
        setFormData((current) => ({ ...current, image: url }));
      } else {
        const figure = `\n<figure class="blog-inline-image"><img src="${url}" alt="" loading="lazy" /></figure>\n`;
        setFormData((current) => ({ ...current, content: `${current.content}${figure}` }));
      }
      toast({
        title: "Image uploaded",
        description: "Publish the post and it will show on the website.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Could not upload the image.",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const wordCount = formData.content.split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200);

  const formTabs = [
    { id: "content", label: "Content", icon: FileText },
    { id: "meta", label: "Meta & Media", icon: Image },
    { id: "seo", label: "SEO Settings", icon: Search },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
              {post ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                {post ? "Edit Blog Post" : "Create New Post"}
              </DialogTitle>
              <DialogDescription className="mt-0.5">
                {post 
                  ? `Editing: ${post.title.substring(0, 40)}...` 
                  : "Write engaging content for your audience"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto py-2 border-b bg-muted/30 -mx-6 px-6">
          {formTabs.map((tab) => (
            <Button
              key={tab.id}
              type="button"
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              className="flex-shrink-0"
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-4 w-4 mr-1.5" />
              {tab.label}
            </Button>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleImageSelected}
          />
          {/* Content Tab */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter an engaging title for your post..."
                  required
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt / Summary *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Write a compelling summary that will appear in post previews..."
                  required
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.excerpt.length}/200 characters recommended
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="content">Full Content *</Label>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openImagePicker("inline")}
                      disabled={uploading !== null}
                    >
                      <Upload className="h-3.5 w-3.5 mr-1.5" />
                      {uploading === "inline" ? "Uploading..." : "Insert image"}
                    </Button>
                    <span>{wordCount} words</span>
                    <span>{readTime} min read</span>
                  </div>
                </div>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your full blog post content here. You can use HTML formatting for rich content..."
                  required
                  rows={15}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Supports HTML formatting for headings, links, lists, and more
                </p>
              </div>
            </div>
          )}

          {/* Meta & Media Tab */}
          {activeTab === "meta" && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <h4 className="text-sm font-semibold mb-4">Post Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author Name *</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Enter author name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="date">Publish Date *</Label>
                  <Input
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="Nov 1, 2024"
                    required
                  />
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="image">Featured Image *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Upload an image or paste an image URL"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => openImagePicker("featured")}
                      disabled={uploading !== null}
                    >
                      <Upload className="h-4 w-4 mr-1.5" />
                      {uploading === "featured" ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                  {formData.image ? (
                    <img
                      src={getImageUrl(formData.image)}
                      alt="Featured preview"
                      className="mt-2 h-40 w-full rounded-lg object-cover border"
                    />
                  ) : null}
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-blue-500/5 border-blue-500/20">
                <h4 className="text-sm font-semibold mb-2 text-blue-700 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Writing Tips
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Use engaging headlines that capture attention</li>
                  <li>Include relevant keywords for SEO</li>
                  <li>Add images to break up long content</li>
                  <li>Keep paragraphs short and scannable</li>
                </ul>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <h4 className="text-sm font-semibold mb-4">SEO Preview</h4>
                <div className="p-4 rounded-lg bg-background border">
                  <p className="text-blue-600 text-lg font-medium truncate">
                    {formData.title || "Your Post Title"}
                  </p>
                  <p className="text-emerald-600 text-sm mt-1">
                    realstateproperties.com/blog/{post?.id || "new-post"}
                  </p>
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                    {formData.excerpt || "Your post excerpt will appear here..."}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-amber-500/5 border-amber-500/20">
                <h4 className="text-sm font-semibold mb-2 text-amber-700">SEO Checklist</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className={cn("h-4 w-4", formData.title.length > 30 ? "text-emerald-500" : "text-muted-foreground")} />
                    Title is at least 30 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className={cn("h-4 w-4", formData.excerpt.length > 100 ? "text-emerald-500" : "text-muted-foreground")} />
                    Excerpt is at least 100 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className={cn("h-4 w-4", wordCount > 300 ? "text-emerald-500" : "text-muted-foreground")} />
                    Content has at least 300 words
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className={cn("h-4 w-4", formData.image ? "text-emerald-500" : "text-muted-foreground")} />
                    Featured image is set
                  </li>
                </ul>
              </div>
            </div>
          )}
        </form>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-4 border-t -mx-6 px-6 bg-background">
          <p className="text-sm text-muted-foreground">
            <span className="text-destructive">*</span> Required fields
          </p>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} data-testid="button-save-blog" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : post ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Update Post
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Publish Post
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
