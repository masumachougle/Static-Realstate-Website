import villaImage from "@assets/generated_images/Luxury_villa_exterior_907e4bf3.png";
import penthouseImage from "@assets/generated_images/Penthouse_living_room_9b43b35a.png";
import bedroomImage from "@assets/generated_images/Luxury_bedroom_interior_bcf3a767.png";
import beachfrontImage from "@assets/generated_images/Beachfront_property_exterior_5ef20cff.png";
import officeImage from "@assets/generated_images/Commercial_office_space_137bc71a.png";
import townhouseImage from "@assets/generated_images/Luxury_townhouse_exterior_0d8185c0.png";
import dubaiImage from "@assets/generated_images/Dubai_skyline_hero_image_312756fe.png";
import villaPanorama from "@assets/generated_images/Villa_living_room_panorama_5949ec99.png";
import penthousePanorama from "@assets/generated_images/Penthouse_bedroom_panorama_9967ed0b.png";
import beachfrontPanorama from "@assets/generated_images/Beachfront_balcony_panorama_4c1078b8.png";
import palmJumeirahAerial from "@assets/generated_images/Palm_Jumeirah_aerial_view_590b8b68.png";

export const imageMap: Record<string, string> = {
  villa_1: villaImage,
  villa_2: penthouseImage,
  villa_3: bedroomImage,
  penthouse_1: penthouseImage,
  penthouse_2: bedroomImage,
  penthouse_3: villaImage,
  beach_1: beachfrontImage,
  beach_2: bedroomImage,
  beach_3: villaImage,
  downtown_1: bedroomImage,
  downtown_2: penthouseImage,
  downtown_3: villaImage,
  commercial_1: officeImage,
  commercial_2: bedroomImage,
  commercial_3: penthouseImage,
  townhouse_1: townhouseImage,
  townhouse_2: bedroomImage,
  townhouse_3: villaImage,
  blog_market_1: dubaiImage,
  blog_palm_1: villaImage,
  blog_commercial_1: officeImage,
  blog_amenities_1: dubaiImage,
  blog_visa_1: villaImage,
  blog_sustainable_1: officeImage,
  villa_panorama: villaPanorama,
  penthouse_panorama: penthousePanorama,
  beachfront_panorama: beachfrontPanorama,
  palm_jumeirah_aerial: palmJumeirahAerial,
};

export function getImageUrl(imageId: string): string {
  if (
    imageId.startsWith("/") ||
    imageId.startsWith("http") ||
    imageId.startsWith("data:") ||
    imageId.startsWith("blob:")
  ) {
    return imageId;
  }
  return imageMap[imageId] || villaImage;
}
