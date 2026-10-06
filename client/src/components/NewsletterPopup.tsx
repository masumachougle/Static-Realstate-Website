import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already subscribed or dismissed
    const hasSubscribed = localStorage.getItem("newsletter-subscribed");
    const hasDismissed = localStorage.getItem("newsletter-dismissed");
    
    if (!hasSubscribed && !hasDismissed) {
      // Show popup after 10 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    // Store subscription in localStorage (in real app, send to backend)
    localStorage.setItem("newsletter-subscribed", "true");
    
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    });

    setIsOpen(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("newsletter-dismissed", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={handleDismiss}
          data-testid="button-dismiss-newsletter"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl text-center">
            Market Trends & Updates
          </DialogTitle>
          <DialogDescription className="text-center">
            Subscribe to receive exclusive property listings, market insights, and special offers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubscribe} className="space-y-4 mt-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="input-newsletter-email"
          />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleDismiss}
              data-testid="button-no-thanks"
            >
              No Thanks
            </Button>
            <Button
              type="submit"
              className="flex-1"
              data-testid="button-subscribe"
            >
              Subscribe
            </Button>
          </div>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-2">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </DialogContent>
    </Dialog>
  );
}
