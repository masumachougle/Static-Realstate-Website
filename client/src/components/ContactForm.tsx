import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertContact } from "@shared/schema";

interface ContactFormProps {
  idPrefix?: string;
  onSuccess?: () => void;
  className?: string;
  compact?: boolean;
}

export default function ContactForm({
  idPrefix = "",
  onSuccess,
  className,
  compact = false,
}: ContactFormProps) {
  const { toast } = useToast();
  const fieldId = (name: string) => (idPrefix ? `${idPrefix}-${name}` : name);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyInterest: "",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting RealState Properties. We'll get back to you shortly.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        propertyInterest: "",
        message: "",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={className ?? (compact ? "space-y-3" : "space-y-5 sm:space-y-6")}
    >
      <div className="space-y-1.5">
        <Label htmlFor={fieldId("name")} className={compact ? "text-sm font-medium" : "text-base font-medium"}>
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id={fieldId("name")}
          required
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="John Smith"
          data-testid="input-name"
          disabled={contactMutation.isPending}
          className={compact ? "h-9 text-sm" : "h-11 sm:h-12 text-base"}
        />
      </div>

      <div className={compact ? "space-y-3" : "grid sm:grid-cols-2 gap-5 sm:gap-6"}>
        <div className="space-y-1.5">
          <Label htmlFor={fieldId("email")} className={compact ? "text-sm font-medium" : "text-base font-medium"}>
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id={fieldId("email")}
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john@example.com"
            data-testid="input-email"
            disabled={contactMutation.isPending}
            className={compact ? "h-9 text-sm" : "h-11 sm:h-12 text-base"}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={fieldId("phone")} className={compact ? "text-sm font-medium" : "text-base font-medium"}>
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id={fieldId("phone")}
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+971 50 123 4567"
            data-testid="input-phone"
            disabled={contactMutation.isPending}
            className={compact ? "h-9 text-sm" : "h-11 sm:h-12 text-base"}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={fieldId("property-interest")} className={compact ? "text-sm font-medium" : "text-base font-medium"}>
          Property Interest
        </Label>
        <Select
          value={formData.propertyInterest}
          onValueChange={(value) => handleChange("propertyInterest", value)}
          disabled={contactMutation.isPending}
        >
          <SelectTrigger
            id={fieldId("property-interest")}
            data-testid="select-property-interest"
            className={compact ? "h-9 text-sm" : "h-11 sm:h-12 text-base"}
          >
            <SelectValue placeholder="Select your interest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buying">Buying Property</SelectItem>
            <SelectItem value="selling">Selling Property</SelectItem>
            <SelectItem value="renting">Renting</SelectItem>
            <SelectItem value="investment">Investment Consulting</SelectItem>
            <SelectItem value="management">Property Management</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={fieldId("message")} className={compact ? "text-sm font-medium" : "text-base font-medium"}>
          Your Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id={fieldId("message")}
          required
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="How can we help you?"
          rows={compact ? 3 : 5}
          data-testid="input-message"
          disabled={contactMutation.isPending}
          className={
            compact
              ? "text-sm resize-none min-h-[72px]"
              : "text-base resize-none min-h-[100px]"
          }
        />
      </div>

      <Button
        type="submit"
        size={compact ? "default" : "lg"}
        className={
          compact
            ? "w-full h-9 text-sm font-medium group"
            : "w-full h-12 sm:h-14 text-base sm:text-lg font-medium group"
        }
        data-testid="button-submit"
        disabled={contactMutation.isPending}
      >
        {contactMutation.isPending ? (
          "Sending..."
        ) : (
          <>
            Send Message
            <ArrowRight className={`ml-2 group-hover:translate-x-1 transition-transform ${compact ? "h-4 w-4" : "h-5 w-5"}`} />
          </>
        )}
      </Button>
    </form>
  );
}
