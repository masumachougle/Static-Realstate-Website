import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { users, properties, blogPosts } from "@shared/schema";
import { hashPassword } from "./auth";
import ws from "ws";

// Configure Neon for WebSocket
neonConfig.webSocketConstructor = ws;

async function seedProduction() {
  // Use production database URL
  const productionUrl = process.env.PRODUCTION_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!productionUrl) {
    throw new Error("PRODUCTION_DATABASE_URL or DATABASE_URL environment variable is required");
  }

  console.log("🚀 Connecting to production database...");
  const pool = new Pool({ connectionString: productionUrl });
  const db = drizzle(pool);

  try {
    console.log("🌱 Seeding production database...");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await db.delete(blogPosts);
    await db.delete(properties);
    await db.delete(users);

    // Create admin user
    const adminPassword = await hashPassword("admin123");
    const [admin] = await db.insert(users).values({
      username: "admin",
      password: adminPassword,
      isAdmin: true,
    }).returning();
    console.log("✅ Admin user created (username: admin, password: admin123)");

    // Create properties
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
    console.log(`✅ ${propertyData.length} properties seeded`);

    // Create blog posts
    const blogData = [
      {
        title: "Dubai Real Estate Market Trends 2024: What Investors Need to Know",
        excerpt: "Explore the latest insights into Dubai's thriving real estate market and discover emerging opportunities for savvy investors looking to capitalize on the city's growth.",
        content: "Dubai's real estate market continues to show remarkable resilience and growth in 2024. With major infrastructure projects nearing completion and the city's position as a global business hub strengthening, property values have seen steady appreciation. Key areas like Dubai Marina, Downtown Dubai, and Palm Jumeirah remain highly sought after by international investors. The introduction of long-term residency visas has further boosted demand, particularly in the luxury segment. Analysts predict continued growth driven by Expo 2020's lasting impact and ongoing economic diversification efforts.",
        category: "Market Insights",
        author: "Sarah Ahmed",
        date: "Nov 1, 2024",
        image: "blog_market_1",
      },
      {
        title: "The Ultimate Guide to Buying Luxury Property in Palm Jumeirah",
        excerpt: "Everything you need to know about investing in one of Dubai's most exclusive addresses. From pricing trends to lifestyle amenities, we cover it all.",
        content: "Palm Jumeirah stands as one of the world's most iconic residential developments, offering an unparalleled blend of luxury, exclusivity, and lifestyle. This man-made archipelago features stunning villas and apartments with private beach access, world-class amenities, and breathtaking views. Investment in Palm Jumeirah properties has historically shown strong returns, with rental yields averaging 5-7% annually. The area boasts five-star hotels, upscale dining, and entertainment options. When purchasing, consider factors such as beachfront access, view corridors, and proximity to the trunk for easier mainland access.",
        category: "Buyer's Guide",
        author: "Mohamed Rahman",
        date: "Oct 28, 2024",
        image: "blog_palm_1",
      },
      {
        title: "Investment Opportunities in Dubai's Commercial Real Estate Sector",
        excerpt: "Discover why Dubai's commercial property market is attracting international investors and how you can benefit from this growing sector.",
        content: "Dubai's commercial real estate sector offers compelling opportunities for investors seeking stable returns and portfolio diversification. Business Bay, DIFC, and Dubai Marina have emerged as prime locations for office and retail spaces. The city's strategic location, tax-friendly environment, and robust infrastructure continue to attract multinational corporations. Commercial properties typically offer higher rental yields than residential, ranging from 7-10%. Key considerations include location accessibility, parking availability, and proximity to business districts. With Dubai's economy expanding and tourism rebounding, the commercial sector shows strong growth potential.",
        category: "Investment",
        author: "James Wilson",
        date: "Oct 25, 2024",
        image: "blog_commercial_1",
      },
      {
        title: "Why Foreign Investors Are Flocking to Dubai Real Estate",
        excerpt: "Understanding the factors that make Dubai a magnet for international property investment and what it means for the market.",
        content: "Dubai has positioned itself as a global investment hub, attracting property buyers from across the world. Key drivers include zero property tax, no capital gains tax, and the option for freehold ownership in designated areas. The Golden Visa program offers 10-year residency for property investments above AED 2 million, providing long-term stability for investors and their families. Political stability, world-class infrastructure, and high quality of life make Dubai particularly attractive to investors from Europe, Asia, and the Americas. The city's continued development and diversification efforts promise sustained growth in property values.",
        category: "Market Insights",
        author: "Lisa Chen",
        date: "Oct 20, 2024",
        image: "blog_investment_1",
      },
      {
        title: "Sustainable Living: Dubai's Green Building Revolution",
        excerpt: "How eco-friendly developments are reshaping Dubai's real estate landscape and what it means for property values.",
        content: "Dubai is embracing sustainable development with ambitious green building initiatives. The Dubai Clean Energy Strategy 2050 aims to make the city a global hub for clean energy and green economy. New developments increasingly feature solar panels, smart home technology, and water-saving systems. Sustainable communities like The Sustainable City and various LEED-certified buildings demonstrate strong market demand. Properties with green certifications command premium prices and attract environmentally conscious buyers. This shift towards sustainability not only benefits the environment but also offers long-term cost savings through reduced utility bills.",
        category: "Sustainability",
        author: "Omar Hassan",
        date: "Oct 15, 2024",
        image: "blog_green_1",
      },
      {
        title: "Navigating the Legal Aspects of Property Purchase in Dubai",
        excerpt: "A comprehensive guide to understanding the legal framework, documentation, and processes involved in buying property in Dubai.",
        content: "Understanding Dubai's property laws is crucial for a smooth transaction. Foreign buyers can purchase freehold properties in designated areas or obtain 99-year leases in other zones. The buying process involves several key steps: obtaining a No Objection Certificate (NOC) from the developer, transferring fees (typically 4% of property value plus AED 5,000 in registration fees), and registering the property with the Dubai Land Department. It's advisable to work with registered real estate agents and legal advisors. Title deeds are issued electronically, ensuring transparency and security. Recent regulatory improvements have made the process more streamlined and investor-friendly.",
        category: "Legal & Regulations",
        author: "Fatima Al Mansouri",
        date: "Oct 10, 2024",
        image: "blog_legal_1",
      },
    ];

    await db.insert(blogPosts).values(blogData);
    console.log(`✅ ${blogData.length} blog posts seeded`);

    console.log("\n🎉 Production database seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - 1 admin user`);
    console.log(`   - ${propertyData.length} properties`);
    console.log(`   - ${blogData.length} blog posts`);
    console.log("\n🔐 Admin credentials:");
    console.log(`   Username: admin`);
    console.log(`   Password: admin123`);

  } catch (error) {
    console.error("❌ Error seeding production database:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedProduction().catch(console.error);
