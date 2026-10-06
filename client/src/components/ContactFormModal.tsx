import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";

export default function ContactFormModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md max-h-[85vh] overflow-y-auto p-4 sm:p-5 gap-0 rounded-xl">
        <DialogHeader className="mb-4 pr-6">
          <DialogTitle className="text-lg font-heading font-semibold flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Send className="h-4 w-4 text-primary" />
            </div>
            Get in Touch
          </DialogTitle>
          <DialogDescription className="text-sm">
            We'll respond within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <ContactForm
          idPrefix="modal"
          compact
          onSuccess={() => setOpen(false)}
        />

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full h-9"
            onClick={() => setOpen(false)}
            data-testid="button-contact-modal-cancel"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
