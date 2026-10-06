import PropertyCard from "../PropertyCard";
import heroImage from "@assets/generated_images/Luxury_villa_exterior_907e4bf3.png";

export default function PropertyCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <PropertyCard
        id="1"
        title="Luxury Waterfront Villa"
        location="Palm Jumeirah, Dubai"
        price="AED 15.5M"
        propertyType="Villa"
        bedrooms={5}
        bathrooms={6}
        size={8500}
        image={heroImage}
      />
    </div>
  );
}
