import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Calendar,
  ArrowRight,
  Navigation,
} from "lucide-react";
import MapLocation from "@/components/MapLocation";
import { useEffect } from "react";
import { useSearch } from "wouter";
import ContactForm from "@/components/ContactForm";
import { useViewingBooking } from "@/contexts/ViewingBookingContext";
import { contactInfo } from "@/lib/contactInfo";

const OFFICE = {
  name: contactInfo.name,
  address: contactInfo.address,
  lat: contactInfo.lat,
  lng: contactInfo.lng,
  phones: [contactInfo.phoneDisplay],
  emails: [contactInfo.emails.info, contactInfo.emails.sales],
};

const highlights = [
  { value: "2 hrs", label: "Avg. Response" },
  { value: "24/7", label: "Online Support" },
  { value: "14+", label: "Years Experience" },
  { value: "98%", label: "Client Satisfaction" },
];

export default function Contact() {
  const search = useSearch();
  const { openViewingBooking } = useViewingBooking();

  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get("book-viewing") === "1") {
      openViewingBooking({
        propertyId: params.get("property") ?? undefined,
        propertyTitle: params.get("title") ?? undefined,
      });
    }
  }, [search, openViewingBooking]);

  const openDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${OFFICE.lat},${OFFICE.lng}`,
      "_blank",
    );
  };

  return (
    <div className="pt-20">
      {/* Hero + stats */}
      <div className="relative">
        <div className="page-hero">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div className="page-container-wide page-hero-content pb-14 sm:pb-16">
            <div className="max-w-3xl space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Mail className="h-4 w-4" />
                Get in Touch
              </div>
              <h1 className="page-hero-title">
                Contact Our{" "}
                <span className="text-gradient-highlight">
                  Experts
                </span>
              </h1>
              <p className="page-hero-description">
                Whether buying, selling, or investing — your expert guide for Dubai's luxury property market.
              </p>
            </div>
          </div>
        </div>

        <div className="page-container-wide relative z-10 -mt-10 sm:-mt-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="glass-card px-4 py-4 sm:px-5 sm:py-5 text-center shadow-md hover-elevate transition-all duration-300 bg-card/95"
              >
                <p className="text-2xl sm:text-3xl font-heading font-semibold text-primary">
                  {item.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form + Contact Info */}
      <section className="py-10 sm:py-12 lg:py-14 bg-gradient-to-b from-background via-background to-card/30">
        <div className="page-container-wide">
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-3">
              <Card className="p-5 sm:p-7 shadow-lg border border-card-border/80 hover-elevate transition-all duration-300">
                <div className="mb-5 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-heading font-semibold mb-2 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Send className="h-4 w-4 text-primary" />
                    </div>
                    Get in touch for your enquiries!
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Our team of experts will respond within 24hours.
                  </p>
                </div>

                <ContactForm />
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <Card className="p-5 sm:p-6 shadow-lg hover-elevate transition-all duration-300 border-card-border/80">
                <h3 className="text-xl font-heading font-semibold mb-5">
                  Contact Information
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Our Office</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {OFFICE.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Phone</h4>
                      {OFFICE.phones.map((phone) => (
                        <p key={phone} className="text-sm text-muted-foreground">
                          <a
                            href={`tel:${phone.replace(/\s/g, "")}`}
                            className="hover:text-primary transition-colors"
                          >
                            {phone}
                          </a>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Email</h4>
                      {OFFICE.emails.map((email) => (
                        <p key={email} className="text-sm text-muted-foreground">
                          <a
                            href={`mailto:${email}`}
                            className="hover:text-primary transition-colors break-all"
                          >
                            {email}
                          </a>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Business Hours</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Sunday - Thursday: 9:00 AM - 6:00 PM
                        <br />
                        Saturday: 10:00 AM - 4:00 PM
                        <br />
                        Friday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-5 sm:p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5 border border-primary/20 shadow-lg hover-elevate transition-all duration-300">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-1">
                      Schedule a Viewing
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Book a personalized property viewing with one of our expert consultants.
                    </p>
                  </div>
                </div>
                <Button
                  variant="default"
                  className="w-full h-11 font-medium group"
                  onClick={() => openViewingBooking()}
                  data-testid="button-schedule-viewing"
                >
                  Book a Viewing
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>

              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">We're Online</p>
                    <p className="text-xs text-muted-foreground">
                      Average response time: 2 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office map */}
      <section className="py-10 sm:py-12 lg:py-14 bg-card border-t">
        <div className="page-container-wide">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-primary mb-2">
                Find Us
              </p>
              <h2 className="text-2xl sm:text-3xl font-heading font-light">
                Our <span className="font-semibold">Office Location</span>
              </h2>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto h-10 sm:h-11 font-medium group flex-shrink-0"
              onClick={openDirections}
              data-testid="button-get-directions"
            >
              <Navigation className="mr-2 h-4 w-4" />
              Get Directions
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="relative z-0 rounded-xl overflow-hidden border shadow-lg min-h-[280px] sm:min-h-[360px] lg:min-h-[400px]">
            <MapLocation
              title={`${OFFICE.name} — ${OFFICE.address}`}
              lat={OFFICE.lat}
              lng={OFFICE.lng}
              zoom={12}
              interactive
              className="h-[280px] sm:h-[360px] lg:h-[400px] w-full rounded-none"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
