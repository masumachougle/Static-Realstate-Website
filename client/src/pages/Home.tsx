import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Users,
  Key,
  TrendingUp,
  CheckCircle,
  Crown,
  Globe,
  Home as HomeIcon,
  Building,
  ArrowRight,
} from "lucide-react";
import Hero from "@/components/Hero";
import FeaturedPropertiesCarousel from "@/components/FeaturedPropertiesCarousel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import type { Property } from "@shared/schema";
import officeImage from "@assets/generated_images/Commercial_office_space_137bc71a.png";

export default function Home() {
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const featuredProperties = properties;

  const services = [
    {
      icon: Key,
      title: "Property Sales",
      description: "Exclusive access for elite buyers to the best properties in Dubai.",
    },
    {
      icon: Building2,
      title: "Property Rentals",
      description: "High-end rental options for both monthly and yearly rentals.",
    },
    {
      icon: TrendingUp,
      title: "Investment Consulting",
      description: "Professional guidance on opportunities for high-return real estate properties.",
    },
    {
      icon: Users,
      title: "Property Management",
      description: "Wide range of management solutions for property owners.",
    },
  ];

  const clientTypes = [
    {
      icon: Crown,
      title: "High Income Individuals",
      description: "Tailored luxury acquisitions for discerning buyers.",
    },
    {
      icon: Globe,
      title: "Global Expatriates",
      description: "Seamless relocation and investment support in Dubai.",
    },
    {
      icon: HomeIcon,
      title: "First-Time Homeowners",
      description: "Guided journeys from search to your first home.",
    },
    {
      icon: Building,
      title: "Corporate and Enterprise Clients",
      description: "Portfolio solutions for businesses and institutions.",
    },
  ];

  const stats = [
    { value: "14+", label: "Years of Excellence" },
    { value: "500+", label: "Properties Sold" },
    { value: "98%", label: "Client Satisfaction" },
  ];

  return (
    <div>
      <Hero />

      <section className="relative z-10 section-padding px-4 bg-background rounded-t-[2rem] sm:rounded-t-[2.5rem] shadow-[0_-24px_48px_-12px_rgba(0,0,0,0.12)]">
        <div className="page-container">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium uppercase tracking-[0.12em] mb-4">
              Portfolio
            </span>
            <h2 className="section-heading">
              Featured <span className="font-semibold">Properties</span>
            </h2>
            <p className="section-subheading mx-auto">
              Discover the finest luxury residences in Dubai's exclusive communities.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-80 sm:h-96 animate-pulse bg-muted" />
              ))}
            </div>
          ) : (
            <FeaturedPropertiesCarousel properties={featuredProperties} />
          )}

          <div className="text-center">
            <Link href="/properties">
              <Button size="lg" className="w-full sm:w-auto px-8" data-testid="button-view-all-properties">
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding px-4 bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="page-container relative">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium uppercase tracking-[0.12em] mb-4">
              What We Offer
            </span>
            <h2 className="section-heading">
              Our <span className="font-semibold">Services</span>
            </h2>
            <p className="section-subheading mx-auto">
              Wide range of real estate assistance suited to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="group p-5 sm:p-6 glass-card hover-elevate border-card-border/80"
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-primary/60 mb-1">
                        0{index + 1}
                      </p>
                      <h3 className="text-base sm:text-lg font-heading font-semibold mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding px-4 bg-background">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium uppercase tracking-[0.12em] mb-4">
                Why Ksenza Hayat Properties
              </span>
              <h2 className="section-heading">
                Why Choose <span className="font-semibold">Ksenza Hayat Properties</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
                Ksenza Hayat Properties has been the leading option for highly selective individuals looking for
                outstanding properties and excellent service in Dubai's luxury real estate market
                for more than a decade.
              </p>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-3 sm:p-4 rounded-xl bg-card border border-card-border/60"
                  >
                    <p className="text-xl sm:text-2xl lg:text-3xl font-heading font-semibold text-primary">
                      {stat.value}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 leading-tight">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "Exclusive access to premium luxury properties",
                  "Expert knowledge of Dubai's prime locations",
                  "Individualized support and dedicated assistance",
                  "Wide network of high-net-worth clients",
                  "Proven track record of successful transactions",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <span className="text-sm sm:text-base text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/about">
                <Button size="lg" className="w-full sm:w-auto group" data-testid="button-learn-more">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-br from-primary/15 to-accent/20 rounded-2xl -z-10" />
              <img
                src={officeImage}
                alt="Luxury Property"
                className="rounded-xl w-full h-64 sm:h-80 lg:h-[480px] object-cover shadow-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding px-4 bg-accent/40 border-y border-border/50">
        <div className="page-container">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium uppercase tracking-[0.12em] mb-4">
              Clients
            </span>
            <h2 className="section-heading">
              Who <span className="font-semibold">We Serve</span>
            </h2>
            <p className="section-subheading mx-auto">
              Specialised strategies designed to meet the unique needs of each client.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            {clientTypes.map((client, index) => {
              const Icon = client.icon;
              return (
                <Card
                  key={index}
                  className="group p-5 sm:p-6 glass-card hover-elevate text-center border-card-border/80"
                >
                  <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary/10 mb-4 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <h3 className="text-sm sm:text-base font-heading font-semibold mb-2">
                    {client.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {client.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding px-4 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90 pointer-events-none" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        <div className="page-container relative text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-light mb-4 sm:mb-5 leading-tight max-w-3xl mx-auto">
            Ready to Find Your <span className="font-semibold">Dream Home?</span>
          </h2>
          <p className="text-base sm:text-lg text-primary-foreground/85 mb-8 max-w-xl mx-auto leading-relaxed">
            Explore Dubai's finest properties with expert guidance every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link href="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto shadow-lg"
                data-testid="button-contact-us"
              >
                Contact Us Today
              </Button>
            </Link>
            <Link href="/properties">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20"
                data-testid="button-browse-properties"
              >
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
