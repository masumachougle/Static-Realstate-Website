import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CurrencyConverterProps {
  priceAED: number;
  className?: string;
  priceClassName?: string;
}

const EXCHANGE_RATES = {
  AED: 1,
  USD: 0.27, // 1 AED = ~0.27 USD
  EUR: 0.25, // 1 AED = ~0.25 EUR
  GBP: 0.22, // 1 AED = ~0.22 GBP
  CNY: 1.96, // 1 AED = ~1.96 CNY
  RUB: 25.83, // 1 AED = ~25.83 RUB
};

const CURRENCY_SYMBOLS = {
  AED: 'AED',
  USD: '$',
  EUR: '€',
  GBP: '£',
  CNY: '¥',
  RUB: '₽',
};

export default function CurrencyConverter({
  priceAED,
  className = "",
  priceClassName = "font-heading font-semibold text-lg",
}: CurrencyConverterProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<keyof typeof EXCHANGE_RATES>("AED");
  
  const convertedPrice = priceAED * EXCHANGE_RATES[selectedCurrency];

  const formatCurrency = (value: number, currency: keyof typeof EXCHANGE_RATES) => {
    if (value >= 1000000) {
      return `${CURRENCY_SYMBOLS[currency]} ${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${CURRENCY_SYMBOLS[currency]} ${(value / 1000).toFixed(0)}K`;
    }
    return `${CURRENCY_SYMBOLS[currency]} ${value.toFixed(0)}`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as keyof typeof EXCHANGE_RATES)}>
        <SelectTrigger className="w-24" data-testid="select-currency">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AED">AED</SelectItem>
          <SelectItem value="USD">USD</SelectItem>
          <SelectItem value="EUR">EUR</SelectItem>
          <SelectItem value="GBP">GBP</SelectItem>
          <SelectItem value="CNY">CNY</SelectItem>
          <SelectItem value="RUB">RUB</SelectItem>
        </SelectContent>
      </Select>
      <span className={priceClassName} data-testid="text-converted-price">
        {formatCurrency(convertedPrice, selectedCurrency)}
      </span>
      {selectedCurrency !== "AED" && (
        <span className="text-xs text-muted-foreground">
          ≈ AED {(priceAED / 1000000).toFixed(1)}M
        </span>
      )}
    </div>
  );
}
