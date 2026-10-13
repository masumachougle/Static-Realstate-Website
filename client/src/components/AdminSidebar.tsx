import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  Building2, FileText, Mail, LogOut, 
  Globe, Activity, Users, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Property {
  id: string;
  status: string;
}

interface Contact {
  id: string;
}

interface CurrentUser {
  id: number;
  username: string;
  name: string | null;
  role: string;
  isAdmin: boolean;
  canManageProperties: boolean;
  canManageBlogs: boolean;
  canViewLeads: boolean;
}

export function AdminSidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  // Fetch current user to check permissions
  const { data: currentUser } = useQuery<CurrentUser>({
    queryKey: ["/api/users/me"],
  });

  const { data: properties } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: contacts } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
    enabled: currentUser?.isAdmin || currentUser?.canViewLeads,
  });

  const stats = {
    totalProperties: properties?.length || 0,
    availableProperties: properties?.filter(p => p.status === "available").length || 0,
    totalInquiries: contacts?.length || 0,
  };

  // Check permissions - super admins have all permissions
  const hasPermission = (permission: 'properties' | 'blogs' | 'leads' | 'users' | 'settings') => {
    if (!currentUser) return false;
    if (currentUser.isAdmin) return true;
    
    switch (permission) {
      case 'properties':
        return currentUser.canManageProperties;
      case 'blogs':
        return currentUser.canManageBlogs;
      case 'leads':
        return currentUser.canViewLeads;
      case 'users':
        return false; // Only super admins can manage users
      case 'settings':
        return true; // Everyone can access their own settings
      default:
        return false;
    }
  };

  const allMenuItems = [
    {
      title: "Properties",
      url: "/admin/properties",
      icon: Building2,
      badge: stats.totalProperties > 0 ? stats.totalProperties.toString() : null,
      permission: 'properties' as const,
    },
    {
      title: "Blog Posts",
      url: "/admin/blog",
      icon: FileText,
      badge: null,
      permission: 'blogs' as const,
    },
    {
      title: "Inquiries",
      url: "/admin/inquiries",
      icon: Mail,
      badge: stats.totalInquiries > 0 ? stats.totalInquiries.toString() : null,
      highlight: stats.totalInquiries > 0,
      permission: 'leads' as const,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
      badge: null,
      permission: 'users' as const,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
      badge: null,
      permission: 'settings' as const,
    },
  ];

  // Filter menu items based on user permissions
  const menuItems = allMenuItems.filter(item => hasPermission(item.permission));

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold tracking-tight truncate">RealState Properties</h2>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <div className="p-3 mt-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">Properties</span>
              </div>
              <p className="text-lg font-bold mt-1">{stats.totalProperties}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs text-muted-foreground">Available</span>
              </div>
              <p className="text-lg font-bold mt-1 text-emerald-600">{stats.availableProperties}</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      data-testid={`link-admin-${item.title.toLowerCase().replace(' ', '-')}`}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-[10px] px-1.5 py-0 h-5 min-w-5 justify-center",
                              item.highlight && "bg-primary text-primary-foreground"
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 mb-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-sm font-bold">
            {currentUser?.name?.charAt(0).toUpperCase() || currentUser?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentUser?.name || currentUser?.username || "User"}</p>
            <p className="text-xs text-muted-foreground">
              {currentUser?.isAdmin ? "Super Admin" : currentUser?.role || "User"}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-9 text-xs"
            onClick={() => window.open("/", "_blank")}
            data-testid="button-view-site"
          >
            <Globe className="h-3.5 w-3.5 mr-1.5" />
            View Site
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
            data-testid="button-logout"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-muted-foreground">System Online</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
