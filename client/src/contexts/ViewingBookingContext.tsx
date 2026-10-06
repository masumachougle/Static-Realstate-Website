import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import ViewingBookingModal from "@/components/ViewingBookingModal";

export interface ViewingBookingOptions {
  propertyId?: string;
  propertyTitle?: string;
}

interface ViewingBookingContextType {
  openViewingBooking: (options?: ViewingBookingOptions) => void;
}

const ViewingBookingContext = createContext<ViewingBookingContextType | undefined>(
  undefined,
);

export function ViewingBookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ViewingBookingOptions>({});

  const openViewingBooking = useCallback((opts: ViewingBookingOptions = {}) => {
    setOptions(opts);
    setOpen(true);
  }, []);

  return (
    <ViewingBookingContext.Provider value={{ openViewingBooking }}>
      {children}
      <ViewingBookingModal
        open={open}
        onOpenChange={setOpen}
        propertyId={options.propertyId}
        propertyTitle={options.propertyTitle}
      />
    </ViewingBookingContext.Provider>
  );
}

export function useViewingBooking() {
  const context = useContext(ViewingBookingContext);
  if (!context) {
    throw new Error("useViewingBooking must be used within a ViewingBookingProvider");
  }
  return context;
}
