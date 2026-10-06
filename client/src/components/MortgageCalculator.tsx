import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calculator, Home, Percent, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface MortgageCalculatorProps {
  defaultPrice?: number;
  propertyTitle?: string;
  className?: string;
}

export default function MortgageCalculator({
  defaultPrice = 5000000,
  propertyTitle,
  className,
}: MortgageCalculatorProps) {
  const [propertyPrice, setPropertyPrice] = useState(defaultPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(25);
  const [userEditedPrice, setUserEditedPrice] = useState(false);

  useEffect(() => {
    if (!userEditedPrice) {
      setPropertyPrice(defaultPrice);
    }
  }, [defaultPrice, userEditedPrice]);

  const downPayment = propertyPrice * (downPaymentPercent / 100);
  const loanAmount = propertyPrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  let monthlyPayment = 0;
  if (monthlyRate > 0) {
    monthlyPayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  } else {
    monthlyPayment = loanAmount / numberOfPayments;
  }

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - loanAmount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card
      id="mortgage-calculator"
      className={cn(
        "overflow-hidden shadow-sm border-card-border",
        propertyTitle && "border-primary/15 shadow-lg",
        className
      )}
      data-testid="mortgage-calculator"
    >
      {propertyTitle && <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />}

      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-heading font-semibold">Mortgage Calculator</h3>
            {propertyTitle ? (
              <div className="mt-1.5 space-y-1">
                <p className="text-sm text-muted-foreground line-clamp-2">{propertyTitle}</p>
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                  Listing price applied
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Estimate your monthly payments</p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="property-price" className="flex items-center gap-2 text-sm">
              <Home className="h-4 w-4 text-primary" />
              Property Price
            </Label>
            <Input
              id="property-price"
              type="number"
              value={propertyPrice}
              onChange={(e) => {
                setPropertyPrice(Number(e.target.value));
                setUserEditedPrice(true);
              }}
              className="text-base sm:text-lg"
              data-testid="input-property-price"
            />
            <p className="text-sm text-muted-foreground">{formatCurrency(propertyPrice)}</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="down-payment" className="flex items-center gap-2 text-sm">
              <Percent className="h-4 w-4 text-primary" />
              Down Payment: {downPaymentPercent}%
            </Label>
            <Slider
              id="down-payment"
              min={10}
              max={50}
              step={5}
              value={[downPaymentPercent]}
              onValueChange={(value) => setDownPaymentPercent(value[0])}
              data-testid="slider-down-payment"
            />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-muted/40 px-3 py-2">
                <span className="block text-xs text-muted-foreground">Down payment</span>
                <span className="font-medium">{formatCurrency(downPayment)}</span>
              </div>
              <div className="rounded-lg bg-muted/40 px-3 py-2">
                <span className="block text-xs text-muted-foreground">Loan amount</span>
                <span className="font-medium">{formatCurrency(loanAmount)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="interest-rate" className="flex items-center gap-2 text-sm">
              <Percent className="h-4 w-4 text-primary" />
              Interest Rate: {interestRate.toFixed(2)}%
            </Label>
            <Slider
              id="interest-rate"
              min={2}
              max={8}
              step={0.1}
              value={[interestRate]}
              onValueChange={(value) => setInterestRate(value[0])}
              data-testid="slider-interest-rate"
            />
            <p className="text-xs text-muted-foreground">Typical UAE mortgage rates: 3.5% - 5.5%</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="loan-term" className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              Loan Term: {loanTerm} years
            </Label>
            <Slider
              id="loan-term"
              min={5}
              max={30}
              step={5}
              value={[loanTerm]}
              onValueChange={(value) => setLoanTerm(value[0])}
              data-testid="slider-loan-term"
            />
            <p className="text-xs text-muted-foreground">{numberOfPayments} monthly payments</p>
          </div>

          <div className="pt-5 border-t space-y-4">
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 sm:p-5">
              <p className="text-sm text-muted-foreground mb-1">Estimated Monthly Payment</p>
              <p
                className="text-2xl sm:text-3xl font-heading font-semibold text-primary break-words"
                data-testid="text-monthly-payment"
              >
                {formatCurrency(monthlyPayment)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border/60 bg-card p-3 sm:p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Interest</p>
                <p className="text-sm font-semibold break-words" data-testid="text-total-interest">
                  {formatCurrency(totalInterest)}
                </p>
              </div>
              <div className="rounded-lg border border-border/60 bg-card p-3 sm:p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Payment</p>
                <p className="text-sm font-semibold break-words" data-testid="text-total-payment">
                  {formatCurrency(totalPayment)}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            * Estimates only. Actual terms may vary based on your profile and lender requirements.
          </p>
        </div>
      </div>
    </Card>
  );
}
