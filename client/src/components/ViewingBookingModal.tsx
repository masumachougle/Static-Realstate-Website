import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  Home,
  ArrowRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertContact, Property } from "@shared/schema";

const TIME_SLOTS = [
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
] as const;

function getAvailableTimeSlots(date: Date | undefined) {
  if (!date) return [...TIME_SLOTS];
  const day = date.getDay();
  if (day === 5) return [];
  if (day === 6) {
    return TIME_SLOTS.filter((slot) => slot.value >= "10:00" && slot.value <= "16:00");
  }
  return [...TIME_SLOTS];
}

function isDateUnavailable(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return true;
  return date.getDay() === 5;
}

interface ViewingBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId?: string;
  propertyTitle?: string;
}

export default function ViewingBookingModal({
  open,
  onOpenChange,
  propertyId,
  propertyTitle,
}: ViewingBookingModalProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyId: "",
    timeSlot: "",
    notes: "",
  });

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
    enabled: open,
  });

  const availableSlots = useMemo(
    () => getAvailableTimeSlots(selectedDate),
    [selectedDate],
  );

  const selectedProperty = useMemo(() => {
    const id = propertyId || formData.propertyId;
    if (!id) return null;
    return properties.find((p) => p.id === id) ?? null;
  }, [propertyId, formData.propertyId, properties]);

  const displayPropertyTitle =
    propertyTitle || selectedProperty?.title || "";

  useEffect(() => {
    if (!open) {
      setSelectedDate(undefined);
      setCalendarOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        propertyId: propertyId ?? "",
        timeSlot: "",
        notes: "",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      propertyId: propertyId ?? prev.propertyId,
    }));
  }, [open, propertyId]);

  useEffect(() => {
    if (formData.timeSlot && !availableSlots.some((s) => s.value === formData.timeSlot)) {
      setFormData((prev) => ({ ...prev, timeSlot: "" }));
    }
  }, [availableSlots, formData.timeSlot]);

  const bookingMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onError: () => {
      toast({
        title: "Booking failed",
        description: "We couldn't submit your viewing request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !formData.timeSlot) {
      toast({
        title: "Missing details",
        description: "Please select a preferred date and time for your viewing.",
        variant: "destructive",
      });
      return;
    }

    const propertyLabel = displayPropertyTitle || "General inquiry (no specific property)";
    const dateLabel = format(selectedDate, "EEEE, MMMM d, yyyy");
    const timeLabel =
      TIME_SLOTS.find((s) => s.value === formData.timeSlot)?.label ?? formData.timeSlot;

    const firstName = formData.name.split(" ")[0] || "there";
    const propertyName = displayPropertyTitle || "your selected property";
    const resolvedPropertyId = propertyId || formData.propertyId || undefined;

    bookingMutation.mutate(
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        propertyInterest: "viewing",
        message: `Viewing request for ${propertyLabel} on ${dateLabel} at ${timeLabel}`,
        propertyId: resolvedPropertyId ?? null,
        propertyTitle: displayPropertyTitle || null,
        preferredDate: format(selectedDate, "yyyy-MM-dd"),
        preferredTime: formData.timeSlot,
        notes: formData.notes.trim() || null,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast({
            title: "Viewing request submitted",
            description: `Thanks, ${firstName}! We'll confirm your ${propertyName} viewing within 2 hours.`,
            className: "border-green-200/80 bg-background",
            duration: 8000,
          });
        },
      },
    );
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-6 gap-0 rounded-xl">
        <DialogHeader className="mb-5 pr-6">
              <DialogTitle className="text-xl font-heading font-semibold flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                </div>
                Book a Property Viewing
              </DialogTitle>
              <DialogDescription className="text-sm">
                Choose your preferred date and time. A consultant will confirm within 2 hours.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {propertyId && propertyTitle ? (
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <Home className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-0.5">
                        Property
                      </p>
                      <p className="text-sm font-medium leading-snug">{propertyTitle}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label htmlFor="viewing-property">
                    Property <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.propertyId}
                    onValueChange={(value) => handleChange("propertyId", value)}
                    disabled={bookingMutation.isPending}
                    required
                  >
                    <SelectTrigger id="viewing-property" data-testid="select-viewing-property">
                      <SelectValue placeholder="Select a property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.title} — {property.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>
                    Preferred Date <span className="text-destructive">*</span>
                  </Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full h-11 justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                        data-testid="button-viewing-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setCalendarOpen(false);
                        }}
                        disabled={isDateUnavailable}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">Closed Fridays</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="viewing-time">
                    Preferred Time <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.timeSlot}
                    onValueChange={(value) => handleChange("timeSlot", value)}
                    disabled={bookingMutation.isPending || !selectedDate || availableSlots.length === 0}
                    required
                  >
                    <SelectTrigger id="viewing-time" data-testid="select-viewing-time">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <SelectValue
                          placeholder={
                            !selectedDate
                              ? "Select date first"
                              : availableSlots.length === 0
                                ? "No slots available"
                                : "Select time"
                          }
                        />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="viewing-name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="viewing-name"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="John Smith"
                  disabled={bookingMutation.isPending}
                  data-testid="input-viewing-name"
                  className="h-11"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="viewing-email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="viewing-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="john@example.com"
                    disabled={bookingMutation.isPending}
                    data-testid="input-viewing-email"
                    className="h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="viewing-phone">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="viewing-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+971 50 123 4567"
                    disabled={bookingMutation.isPending}
                    data-testid="input-viewing-phone"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="viewing-notes">Additional Notes</Label>
                <Textarea
                  id="viewing-notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Any special requests or questions..."
                  rows={3}
                  disabled={bookingMutation.isPending}
                  className="resize-none text-sm"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={handleClose}
                  disabled={bookingMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 group"
                  disabled={
                    bookingMutation.isPending ||
                    (!propertyId && !formData.propertyId)
                  }
                  data-testid="button-submit-viewing"
                >
                  {bookingMutation.isPending ? (
                    "Submitting..."
                  ) : (
                    <>
                      Book Viewing
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </form>
      </DialogContent>
    </Dialog>
  );
}
