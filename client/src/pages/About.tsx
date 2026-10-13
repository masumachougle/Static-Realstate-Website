import { Target, Eye, Award, Users, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import officeImage from "@assets/generated_images/Office_exterior_image_0e474c6d.png";
import dubaiImage from "@assets/generated_images/hero_image.png";

const stats = [
  { value: "14+", label: "Years Experience" },
  { value: "2,500+", label: "Properties Sold" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "AED 5B+", label: "Transaction Volume" },
];


const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "Our mission is to deliver exceptional luxury real estate services. Exclusive opportunities that elevate Dubai's luxury real estate experience for our clients.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "Our vision is to set the standard for luxury real estate in Dubai, known for integrity and premium service.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We ensure high quality and attention to detail in Dubai's premium real estate market services.",
  },
  {
    icon: Users,
    title: "Client Focus",
    description:
      "At RealState Properties, we prioritise our clients, providing expert advice and premium service that delivers achievable success.",
  },
];

export default function About() {
  return (
    <div className="pt-20">
      {/* Hero + stats */}
      <div className="relative">
        <div
          className="relative h-96 flex items-center justify-center"
          style={{
            backgroundImage: `url(${officeImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
          <div className="relative z-10 text-center text-white px-4 space-y-3 sm:space-y-4 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-light leading-tight text-white">
              Discover <span className="font-semibold">RealState Properties</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl leading-relaxed mx-auto">
              Dubai's Exclusive Luxury Real Estate Property Experts.
            </p>
          </div>
        </div>

        <div className="page-container-wide relative z-10 -mt-14 sm:-mt-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-card px-4 py-4 sm:px-5 sm:py-5 text-center shadow-md hover-elevate transition-all duration-300 bg-card/95"
              >
                <p className="text-2xl sm:text-3xl font-heading font-semibold text-primary">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="pt-4 sm:pt-5 pb-16 sm:pb-20 lg:pb-24 px-4 bg-background">
        <div className="page-container-wide">
          <div className="text-center mb-7 sm:mb-9 max-w-3xl mx-auto">
            <h2 className="section-heading">
              Our <span className="font-semibold">Story</span>
            </h2>
            <p className="section-subheading mx-auto">
              Redefining what luxury real estate in Dubai should feel like — meaningful, centred,
              and alive.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className="order-2 lg:order-1">
              <div className="relative rounded-xl border border-primary/15 bg-gradient-to-br from-primary/5 to-accent/5 p-5 sm:p-6 mb-6 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40 rounded-l-xl" />
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pl-2">
                  In 2025, a grounding thought emerged, one that carried the calm of zen and the
                  clarity of true essence.{" "}
                  <span className="font-medium text-foreground">RealState Properties</span> took shape
                  as a name that embodies balance, presence, purpose and values that mirror the
                  foundation of luxury properties in Dubai. Creating spaces that offer harmony,
                  security, and a sense of belonging.
                </p>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  RealState Properties set out to redefine what luxury real estate in Dubai should feel like. A
                  guided experience based on a vision born from stillness, inspired by the desire to
                  shape properties that feel meaningful, centred, and alive.
                </p>
                <p>
                  Our growth is driven by a group of talented real estate professionals who are all
                  committed to contemporary standards and a proactive approach. Each individual at
                  RealState Properties brings extensive market knowledge and a shared commitment to assisting
                  clients in making confident decisions. Creating a culture centred on transparency,
                  insight, and longterm relationships for our customers.
                </p>
                <p>
                  Whether you're searching for the perfect home or a strategic investment, at RealState Properties
                  we guide you through every step. Every property in our portfolio, from
                  sophisticated homes to profitable investment opportunities, is chosen with the same
                  goal in mind. At RealState Properties, we don't just find properties. We help people find the
                  place where their life truly fits.
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative self-start pb-14 sm:pb-16 w-full">
              <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-br from-primary/15 to-accent/20 rounded-2xl -z-10" />
              <img
                src={dubaiImage}
                alt="Dubai skyline"
                className="rounded-xl w-full h-64 sm:h-80 lg:h-[460px] object-cover shadow-xl ring-1 ring-black/5"
              />
              <Card className="absolute left-4 right-4 sm:left-6 sm:right-6 bottom-0 translate-y-1/2 p-4 sm:p-5 glass-card border-card-border/80 shadow-lg bg-card/95">
                <p className="text-sm sm:text-base font-heading font-medium text-center leading-snug italic text-muted-foreground">
                  "Creating spaces that offer harmony, security, and a sense of belonging."
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding px-4 bg-card relative overflow-hidden border-y border-border/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="page-container-wide relative">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium uppercase tracking-[0.12em] mb-4">
              What Drives Us
            </span>
            <h2 className="section-heading">
              Our <span className="font-semibold">Principles</span>
            </h2>
            <p className="section-subheading mx-auto">
              Our core principles that define RealState Properties' approach in Dubai's luxury property market.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
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
                      <h3 className="text-base sm:text-lg font-heading font-semibold mb-2">
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding px-4 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90 pointer-events-none" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        <div className="page-container-wide relative text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-light mb-4 leading-tight max-w-2xl mx-auto">
            Ready to Work <span className="font-semibold">With Us?</span>
          </h2>
          <p className="text-base sm:text-lg text-primary-foreground/85 mb-8 max-w-lg mx-auto leading-relaxed">
            Let our team guide you to your next luxury property in Dubai.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-lg group">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/properties">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20"
              >
                View Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
