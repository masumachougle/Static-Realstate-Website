import "./envSetup.js";
import { db } from "./db";
import { users, properties, blogPosts } from "@shared/schema";
import { hashPassword } from "./auth";
import { loadAllBlogFiles, toDbImage } from "./blogContent";

async function seed() {
  console.log("Seeding database...");

  const adminPassword = await hashPassword("admin123");
  const [admin] = await db.insert(users).values({
    username: "admin",
    password: adminPassword,
    isAdmin: true,
  }).returning();
  console.log("✓ Admin user created (username: admin, password: admin123)");

  const propertyData = [
    {
      title: "Luxury Waterfront Villa",
      description: "Experience unparalleled luxury in this stunning waterfront villa located on the exclusive Palm Jumeirah. This architectural masterpiece combines contemporary design with traditional elegance, offering breathtaking views of the Arabian Gulf and Dubai skyline.",
      price: "15500000",
      propertyType: "Villa",
      location: "Palm Jumeirah, Dubai",
      bedrooms: 5,
      bathrooms: 6,
      size: 8500,
      images: ["villa_1", "villa_2", "villa_3"],
      featured: "true",
      status: "available",
      amenities: ["Private beach access", "Infinity pool", "Smart home system", "Maid's quarters", "Private gym"],
    },
    {
      title: "Modern Penthouse Suite",
      description: "An extraordinary penthouse offering panoramic views of Dubai Marina. This residence features floor-to-ceiling windows, premium finishes, and access to world-class amenities.",
      price: "12800000",
      propertyType: "Penthouse",
      location: "Dubai Marina, Dubai",
      bedrooms: 4,
      bathrooms: 5,
      size: 6200,
      images: ["penthouse_1", "penthouse_2", "penthouse_3"],
      featured: "true",
      status: "sold",
      amenities: ["Sky lounge", "Private elevator", "Wine cellar", "Home theater"],
    },
    {
      title: "Elegant Beachfront Apartment",
      description: "Sophisticated beachfront living with direct access to pristine beaches and marina views. This apartment combines luxury with coastal lifestyle.",
      price: "8200000",
      propertyType: "Apartment",
      location: "Jumeirah Beach Residence",
      bedrooms: 3,
      bathrooms: 4,
      size: 4100,
      images: ["beach_1", "beach_2", "beach_3"],
      featured: "true",
      status: "available",
      amenities: ["Beach access", "Swimming pool", "Gym", "Concierge service"],
    },
    {
      title: "Premium Downtown Apartment",
      description: "Located in the heart of Downtown Dubai, this apartment offers stunning views of the Burj Khalifa and Dubai Fountain.",
      price: "9500000",
      propertyType: "Apartment",
      location: "Downtown Dubai",
      bedrooms: 3,
      bathrooms: 3,
      size: 3800,
      images: ["downtown_1", "downtown_2", "downtown_3"],
      featured: "false",
      status: "available",
      amenities: ["Burj Khalifa views", "Spa", "Swimming pool", "Valet parking"],
    },
    {
      title: "Luxury Commercial Space",
      description: "Prime commercial office space in Business Bay with stunning city views and modern infrastructure.",
      price: "18000000",
      propertyType: "Commercial",
      location: "Business Bay, Dubai",
      size: 12000,
      images: ["commercial_1", "commercial_2", "commercial_3"],
      featured: "false",
      status: "available",
      amenities: ["Conference rooms", "High-speed elevators", "24/7 security", "Parking"],
    },
    {
      title: "Contemporary Townhouse",
      description: "Spacious family townhouse in a gated community with excellent schools and recreational facilities nearby.",
      price: "6500000",
      propertyType: "Townhouse",
      location: "Arabian Ranches",
      bedrooms: 4,
      bathrooms: 4,
      size: 4500,
      images: ["townhouse_1", "townhouse_2", "townhouse_3"],
      featured: "false",
      status: "available",
      amenities: ["Community pool", "Parks", "Golf course access", "Kids play area"],
    },
  ];

  await db.insert(properties).values(propertyData);
  console.log(`✓ ${propertyData.length} properties seeded`);

  const blogFiles = loadAllBlogFiles();
  const blogData = blogFiles.map((post) => ({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    author: post.author,
    date: post.date,
    image: toDbImage(post.featuredImage),
  }));

  if (blogData.length > 0) {
    await db.insert(blogPosts).values(blogData);
  }
  console.log(`✓ ${blogData.length} blog posts seeded from content/blogs`);

  console.log("\n✅ Database seeded successfully!");
  console.log("\nAdmin credentials:");
  console.log("  Username: admin");
  console.log("  Password: admin123");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
