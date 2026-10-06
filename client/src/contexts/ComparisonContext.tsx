import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import type { Property } from "@shared/schema";

const COMPARISON_ROUTES = ["/properties", "/compare"];

interface ComparisonContextType {
  selectedProperties: Property[];
  addToComparison: (property: Property) => void;
  removeFromComparison: (propertyId: string) => void;
  clearComparison: () => void;
  isInComparison: (propertyId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [location] = useLocation();

  useEffect(() => {
    if (!COMPARISON_ROUTES.includes(location)) {
      setSelectedProperties([]);
    }
  }, [location]);

  const addToComparison = (property: Property) => {
    setSelectedProperties((prev) => {
      // Max 3 properties for comparison
      if (prev.length >= 3) {
        return prev;
      }
      // Don't add duplicates
      if (prev.some((p) => p.id === property.id)) {
        return prev;
      }
      return [...prev, property];
    });
  };

  const removeFromComparison = (propertyId: string) => {
    setSelectedProperties((prev) => prev.filter((p) => p && p.id !== propertyId));
  };

  const clearComparison = () => {
    setSelectedProperties([]);
  };

  const isInComparison = (propertyId: string) => {
    return selectedProperties.some((p) => p && p.id === propertyId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        selectedProperties,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within ComparisonProvider");
  }
  return context;
}
