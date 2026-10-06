import { Banknote, FileCheck, Handshake, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import MortgageCalculator from "@/components/MortgageCalculator";

const services = [
  {
    icon: Banknote,
    title: "Competitive Rates",
    description:
      "We connect you with affordable mortgage rates from the top banks in the UAE, customized to suit your needs and allowing you to purchase your property comfortably.",
  },
  {
    icon: FileCheck,
    title: "Pre-Approval Support",
    description:
      "Get professional assistance in mortgage documentation and pre-approval so you can proceed with assurance and engage in your hunt for a property ready.",
  },
  {
    icon: Handshake,
    title: "End-to-End Guidance",
    description:
      "End-to-End Assistance From preliminary consultations to eventual approvals, our organization helps you at every level.",
  },
  {
    icon: Shield,
    title: "Transparent Process",
    description:
      "The straightforward explanations of mortgage charges, conditions, and repayment schemes leave no room for surprises so the customer knows what he has to pay in advance.",
  },
];

export default function Mortgages() {
  return (
    <div className="pt-20">
      <div className="page-hero">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="page-container-wide page-hero-content">
          <div className="page-hero-text page-hero-text-standalone">
            <h1 className="page-hero-title">
              <span className="text-gradient-highlight">
                Mortgages
              </span>
            </h1>
            <p className="page-hero-description">
              Plan Your Property Purchase with Expert Mortgage Guidance with an Instant Payment Calculator
            </p>
          </div>
        </div>
      </div>

      <section className="relative py-10 sm:py-16 bg-gradient-to-b from-background via-background to-card/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="page-container-wide relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-light mb-5 sm:mb-6">
                Financing Your <span className="font-semibold">Dream Home in the UAE</span>
              </h2>

              <div className="relative rounded-xl border border-primary/15 bg-gradient-to-br from-primary/5 to-accent/5 p-5 sm:p-6 mb-8 sm:mb-10 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40 rounded-l-xl" />
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed pl-2">
                  <p>
                    Whether you're a first-time homebuyer or growing your real estate portfolio, KSENZA helps you navigate UAE mortgage options with clarity and confidence.
                  </p>
                  <p>
                    With the help of our mortgage calculator, you can easily calculate your monthly payments and connect with our staff to obtain assistance with preapproval and lenders.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <Card
                      key={service.title}
                      className="group relative p-5 sm:p-6 glass-card hover-elevate border-card-border/80 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm">
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-heading font-semibold mb-2">{service.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <MortgageCalculator />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
