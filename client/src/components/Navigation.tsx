import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import MapsNavButton from "@/components/MapsNavButton";
import Logo from "@/components/Logo";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hasTransparentNav = location === "/" && !isScrolled && !isMobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/properties", label: "Properties" },
    { path: "/mortgages", label: "Mortgages" },
    { path: "/about", label: "About Us" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasTransparentNav
          ? "bg-transparent"
          : isMobileMenuOpen
            ? "bg-background shadow-md border-b border-border"
            : "bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50"
      }`}
    >
      <div className="page-container py-3 sm:py-4 lg:py-5">
        <div className="flex items-center justify-between gap-4 min-h-[3.5rem] sm:min-h-[4rem] lg:min-h-[4.5rem]">
          <Link href="/" data-testid="link-home">
            <Logo
              tone={hasTransparentNav ? "light" : "brand"}
              className="cursor-pointer transition-opacity hover:opacity-80"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-3 xl:gap-6 2xl:gap-8 flex-1 justify-center max-w-3xl mx-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                data-testid={`link-${link.label.toLowerCase().replace(" ", "-")}`}
              >
                <span
                  className={`relative whitespace-nowrap font-heading text-[11px] xl:text-xs 2xl:text-sm font-medium tracking-wide cursor-pointer transition-all duration-300 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full after:transition-all after:duration-300 ${
                    location === link.path
                      ? hasTransparentNav
                        ? "text-white after:w-full after:bg-white"
                        : "text-primary after:w-full after:bg-primary"
                      : hasTransparentNav
                        ? "text-white/90 hover:text-white after:w-0 hover:after:w-full after:bg-white/80"
                        : "text-foreground/90 hover:text-primary after:w-0 hover:after:w-full after:bg-primary/70"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <MapsNavButton />
            <Button
              size="icon"
              variant="ghost"
              data-testid="button-search"
              onClick={() => setLocation("/properties")}
              className={`h-10 w-10 ${hasTransparentNav ? "text-white hover:text-white hover:bg-white/10" : ""}`}
            >
              <Search className="h-5 w-5" />
            </Button>
            <div className={hasTransparentNav ? "text-white" : ""}>
              <ThemeToggle />
            </div>
          </div>

          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              className={`h-10 w-10 ${hasTransparentNav ? "text-white hover:text-white hover:bg-white/10" : ""}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-background border-t border-border shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-y-auto overscroll-contain"
          style={{ top: "var(--nav-height)" }}
        >
          <div className="page-container py-6 sm:py-8 flex flex-col gap-8 min-h-full">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  <div
                    className={`rounded-xl px-4 py-3.5 text-base font-heading font-medium tracking-wide cursor-pointer transition-colors ${
                      location === link.path
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-5 border-t border-border pt-6">
              <MapsNavButton
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full justify-center py-2.5"
              />

              <div className="flex items-center justify-between rounded-xl px-4 py-3.5 bg-muted/50 border border-border">
                <span className="text-sm font-medium text-foreground">Theme</span>
                <ThemeToggle />
              </div>

              <Button
                variant="outline"
                className="w-full h-11"
                onClick={() => {
                  setLocation("/properties");
                  setIsMobileMenuOpen(false);
                }}
              >
                <Search className="h-4 w-4 mr-2" />
                Search Properties
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
