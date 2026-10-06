import BlogCard from "../BlogCard";
import blogImage from "@assets/generated_images/Dubai_skyline_hero_image_312756fe.png";

export default function BlogCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <BlogCard
        id="1"
        title="Dubai Real Estate Market Trends 2024"
        excerpt="Explore the latest insights into Dubai's thriving real estate market and discover emerging opportunities for investors."
        category="Market Insights"
        author="Sarah Ahmed"
        date="Nov 1, 2024"
        image={blogImage}
      />
    </div>
  );
}
