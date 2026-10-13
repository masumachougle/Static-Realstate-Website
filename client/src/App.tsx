import { Switch, Route, useLocation, Redirect } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ViewingBookingProvider } from "@/contexts/ViewingBookingContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ComparisonBar from "@/components/ComparisonBar";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { IntroVideo } from "@/components/IntroVideo";
import Home from "@/pages/Home";
import MapPage from "@/pages/Map";
import Properties from "@/pages/Properties";
import PropertyDetail from "@/pages/PropertyDetail";
import PropertyComparison from "@/pages/PropertyComparison";
import Favorites from "@/pages/Favorites";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Contact from "@/pages/Contact";
import Mortgages from "@/pages/Mortgages";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import AdminLogin from "@/pages/AdminLogin";
import AdminProperties from "@/pages/AdminProperties";
import AdminPropertyDetail from "@/pages/AdminPropertyDetail";
import AdminBlog from "@/pages/AdminBlog";
import AdminInquiries from "@/pages/AdminInquiries";
import AdminUsers from "@/pages/AdminUsers";
import AdminSettings from "@/pages/AdminSettings";
import AdminLayout from "@/layouts/AdminLayout";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/map" component={MapPage} />
      <Route path="/properties" component={Properties} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route path="/compare" component={PropertyComparison} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/about" component={About} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogDetail} />
      <Route path="/contact" component={Contact} />
      <Route path="/mortgages" component={Mortgages} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/admin/properties">
        <AdminLayout>
          <AdminProperties />
        </AdminLayout>
      </Route>
      <Route path="/admin/properties/:id">
        <AdminLayout>
          <AdminPropertyDetail />
        </AdminLayout>
      </Route>
      <Route path="/admin/blog">
        <AdminLayout>
          <AdminBlog />
        </AdminLayout>
      </Route>
      <Route path="/admin/inquiries">
        <AdminLayout>
          <AdminInquiries />
        </AdminLayout>
      </Route>
      <Route path="/admin/users">
        <AdminLayout>
          <AdminUsers />
        </AdminLayout>
      </Route>
      <Route path="/admin/settings">
        <AdminLayout>
          <AdminSettings />
        </AdminLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function PublicLayout() {
  const [location] = useLocation();
  const isMapPage = location === "/map";
  const showComparisonBar = location === "/properties";

  return (
    <div className="min-h-screen flex flex-col">
      {!isMapPage && <Navigation />}
      <main className="flex-1">
        <Router />
      </main>
      {!isMapPage && <Footer />}
      {!isMapPage && showComparisonBar && <ComparisonBar />}
      <WhatsAppWidget />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <FavoritesProvider>
              <ViewingBookingProvider>
                <ComparisonProvider>
                  <IntroVideo />
                  <ScrollToTop />
                  <Switch>
                    <Route path="/admin" component={AdminLogin} />
                    <Route path="/admin/login">
                      <Redirect to="/admin" />
                    </Route>
                    <Route path="/admin/:rest*">
                      <Router />
                    </Route>
                    <Route component={PublicLayout} />
                  </Switch>
                  <Toaster />
                </ComparisonProvider>
              </ViewingBookingProvider>
            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
