import { Card } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  email: string;
  phone: string;
}

export default function TeamMember({ name, role, image, email, phone }: TeamMemberProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-heading font-semibold mb-1">{name}</h3>
        <p className="text-primary mb-4">{role}</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{phone}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
