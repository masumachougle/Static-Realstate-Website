import { Link } from "wouter";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Mortgages", href: "/mortgages" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-card border-t relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="page-container py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-heading font-semibold text-primary mb-4">
              RealState Properties
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed max-w-sm">
              Dubai's Premier Luxury Real Estate Partner. Discover exclusive properties in some of Dubai's most renowned communities.
            </p>
            <div className="flex gap-2">
              {[
                { icon: Facebook, testId: "button-social-facebook" },
                { icon: Instagram, testId: "button-social-instagram" },
                { icon: Linkedin, testId: "button-social-linkedin" },
                { icon: Twitter, testId: "button-social-twitter" },
              ].map(({ icon: Icon, testId }) => (
                <Button
                  key={testId}
                  size="icon"
                  variant="ghost"
                  className="hover:text-primary hover:bg-primary/10"
                  data-testid={testId}
                  onClick={() => console.log(`${testId} clicked`)}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm sm:text-base text-muted-foreground">
              <li>Property Sales</li>
              <li>Property Rentals</li>
              <li>Property Management</li>
              <li>Investment Consulting</li>
              <li>Commercial Real Estate</li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm sm:text-base text-muted-foreground">
                  IBN Battuta Mall Gate Office - Dubai
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm sm:text-base text-muted-foreground">+971 50 634 9969</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm sm:text-base text-muted-foreground break-all">info@realstateproperties.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              © 2024 RealState Properties. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
              <Link href="/privacy">
                <span className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                  Privacy Policy
                </span>
              </Link>
              <Link href="/terms">
                <span className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                  Terms of Service
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
