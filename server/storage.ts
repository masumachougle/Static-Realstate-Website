import {
  type User,
  type InsertUser,
  type Property,
  type InsertProperty,
  type BlogPost,
  type InsertBlogPost,
  type Contact,
  type InsertContact,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  updatePassword(id: string, hashedPassword: string): Promise<boolean>;

  getAllProperties(): Promise<Property[]>;
  getPropertyById(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;
  filterProperties(filters: {
    propertyType?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
  }): Promise<Property[]>;

  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;

  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  
  sessionStore?: any;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private properties: Map<string, Property>;
  private blogPosts: Map<string, BlogPost>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.blogPosts = new Map();
    this.contacts = new Map();
    this.seedData();
  }

  private seedData() {
    const properties: InsertProperty[] = [
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

    properties.forEach((prop) => {
      const id = randomUUID();
      this.properties.set(id, {
        ...prop,
        id,
        bedrooms: prop.bedrooms ?? null,
        bathrooms: prop.bathrooms ?? null,
        size: prop.size ?? null,
        featured: prop.featured ?? null,
        status: prop.status ?? null,
        amenities: prop.amenities ?? null,
        createdAt: prop.createdAt ?? null,
        updatedAt: prop.updatedAt ?? null,
      } as Property);
    });

    const blogPosts: InsertBlogPost[] = [
      {
        title: "Dubai Real Estate Market Trends 2024: What Investors Need to Know",
        excerpt: "Explore the latest insights into Dubai's thriving real estate market and discover emerging opportunities for savvy investors looking to capitalize on the city's growth.",
        content: "Dubai's real estate market continues to show remarkable resilience and growth...",
        category: "Market Insights",
        author: "Sarah Ahmed",
        date: "Nov 1, 2024",
        image: "blog_market_1",
      },
      {
        title: "The Ultimate Guide to Buying Luxury Property in Palm Jumeirah",
        excerpt: "Everything you need to know about investing in one of Dubai's most exclusive addresses. From pricing trends to lifestyle amenities, we cover it all.",
        content: "Palm Jumeirah stands as one of the world's most iconic residential developments...",
        category: "Buyer's Guide",
        author: "Mohamed Rahman",
        date: "Oct 28, 2024",
        image: "blog_palm_1",
      },
      {
        title: "Investment Opportunities in Dubai's Commercial Real Estate Sector",
        excerpt: "Discover why Dubai's commercial property market is attracting international investors and how you can benefit from this growing sector.",
        content: "The commercial real estate sector in Dubai presents unique opportunities...",
        category: "Investment",
        author: "Ahmed Al Mansouri",
        date: "Oct 25, 2024",
        image: "blog_commercial_1",
      },
      {
        title: "Top 10 Luxury Amenities Dubai Homebuyers Want in 2024",
        excerpt: "From smart home technology to wellness facilities, learn what features are driving luxury property values in Dubai's premium market.",
        content: "Today's luxury homebuyers in Dubai have sophisticated expectations...",
        category: "Lifestyle",
        author: "Fatima Al Zaabi",
        date: "Oct 20, 2024",
        image: "blog_amenities_1",
      },
      {
        title: "Understanding Dubai's Golden Visa Program for Property Investors",
        excerpt: "A comprehensive overview of how property investment can qualify you for long-term residency in the UAE through the Golden Visa program.",
        content: "The UAE's Golden Visa program has transformed the real estate landscape...",
        category: "Legal & Regulations",
        author: "Sarah Ahmed",
        date: "Oct 15, 2024",
        image: "blog_visa_1",
      },
      {
        title: "Sustainable Living: Dubai's Eco-Friendly Luxury Developments",
        excerpt: "Explore how Dubai's luxury real estate is embracing sustainability without compromising on comfort and elegance.",
        content: "Sustainability is no longer just a buzzword in Dubai's luxury property market...",
        category: "Sustainability",
        author: "Mohamed Rahman",
        date: "Oct 10, 2024",
        image: "blog_sustainable_1",
      },
    ];

    blogPosts.forEach((post) => {
      const id = randomUUID();
      this.blogPosts.set(id, { ...post, id });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: insertUser.isAdmin ?? false,
      role: insertUser.role ?? "user",
      email: insertUser.email ?? null,
      name: insertUser.name ?? null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated: User = { ...user, ...updates, id };
    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async updatePassword(id: string, hashedPassword: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;
    user.password = hashedPassword;
    this.users.set(id, user);
    return true;
  }

  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getPropertyById(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = randomUUID();
    const property = {
      ...insertProperty,
      id,
      bedrooms: insertProperty.bedrooms ?? null,
      bathrooms: insertProperty.bathrooms ?? null,
      size: insertProperty.size ?? null,
      featured: insertProperty.featured ?? null,
      status: insertProperty.status ?? null,
      amenities: insertProperty.amenities ?? null,
      createdAt: insertProperty.createdAt ?? null,
      updatedAt: insertProperty.updatedAt ?? null,
    } as Property;
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: string, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updated: Property = {
      ...property,
      ...updates,
      id,
      bedrooms: updates.bedrooms !== undefined ? updates.bedrooms : property.bedrooms,
      bathrooms: updates.bathrooms !== undefined ? updates.bathrooms : property.bathrooms,
      size: updates.size !== undefined ? updates.size : property.size,
      featured: updates.featured !== undefined ? updates.featured : property.featured,
      status: updates.status !== undefined ? updates.status : property.status,
      amenities: updates.amenities !== undefined ? updates.amenities : property.amenities,
    };
    this.properties.set(id, updated);
    return updated;
  }

  async deleteProperty(id: string): Promise<boolean> {
    return this.properties.delete(id);
  }

  async filterProperties(filters: {
    propertyType?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
  }): Promise<Property[]> {
    let properties = Array.from(this.properties.values());

    if (filters.propertyType && filters.propertyType !== "all") {
      properties = properties.filter(
        (p) => p.propertyType.toLowerCase() === filters.propertyType?.toLowerCase()
      );
    }

    if (filters.location && filters.location !== "all") {
      properties = properties.filter((p) =>
        p.location.toLowerCase().includes(filters.location?.toLowerCase() || "")
      );
    }

    if (filters.minPrice) {
      properties = properties.filter(
        (p) => parseFloat(p.price) >= filters.minPrice!
      );
    }

    if (filters.maxPrice) {
      properties = properties.filter(
        (p) => parseFloat(p.price) <= filters.maxPrice!
      );
    }

    if (filters.bedrooms) {
      properties = properties.filter(
        (p) => (p.bedrooms || 0) >= filters.bedrooms!
      );
    }

    return properties;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = { ...insertPost, id };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    
    const updated: BlogPost = { ...post, ...updates, id };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      propertyInterest: insertContact.propertyInterest ?? null,
      propertyId: insertContact.propertyId ?? null,
      propertyTitle: insertContact.propertyTitle ?? null,
      preferredDate: insertContact.preferredDate ?? null,
      preferredTime: insertContact.preferredTime ?? null,
      notes: insertContact.notes ?? null,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }
}

// Database Storage implementation
import { db } from "./db";
import { getPgPoolConfig } from "./dbConfig";
import { users, properties, blogPosts, contacts } from "@shared/schema";
import { eq, and, gte, lte, sql as drizzleSql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: getPgPoolConfig(),
      createTableIfMissing: true,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({ 
        ...insertUser, 
        isAdmin: insertUser.isAdmin ?? false,
        role: insertUser.role ?? "user",
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(drizzleSql`${users.createdAt} DESC`);
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async updatePassword(id: string, hashedPassword: string): Promise<boolean> {
    const result = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getAllProperties(): Promise<Property[]> {
    return await db.select().from(properties);
  }

  async getPropertyById(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const [property] = await db.insert(properties).values(insertProperty).returning();
    return property;
  }

  async updateProperty(id: string, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    const [updated] = await db
      .update(properties)
      .set(updates)
      .where(eq(properties.id, id))
      .returning();
    return updated;
  }

  async deleteProperty(id: string): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async filterProperties(filters: {
    propertyType?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
  }): Promise<Property[]> {
    const conditions = [];

    if (filters.propertyType && filters.propertyType !== "all") {
      conditions.push(drizzleSql`lower(${properties.propertyType}) = lower(${filters.propertyType})`);
    }

    if (filters.location && filters.location !== "all") {
      conditions.push(drizzleSql`lower(${properties.location}) like lower(${'%' + filters.location + '%'})`);
    }

    if (filters.minPrice) {
      conditions.push(gte(drizzleSql`CAST(${properties.price} AS numeric)`, filters.minPrice));
    }

    if (filters.maxPrice) {
      conditions.push(lte(drizzleSql`CAST(${properties.price} AS numeric)`, filters.maxPrice));
    }

    if (filters.bedrooms) {
      conditions.push(gte(properties.bedrooms, filters.bedrooms));
    }

    if (conditions.length === 0) {
      return await db.select().from(properties);
    }

    return await db.select().from(properties).where(and(...conditions));
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(insertPost).returning();
    return post;
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db
      .update(blogPosts)
      .set(updates)
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values({
        name: insertContact.name,
        email: insertContact.email,
        phone: insertContact.phone,
        propertyInterest: insertContact.propertyInterest ?? null,
        message: insertContact.message,
        propertyId: insertContact.propertyId ?? null,
        propertyTitle: insertContact.propertyTitle ?? null,
        preferredDate: insertContact.preferredDate ?? null,
        preferredTime: insertContact.preferredTime ?? null,
        notes: insertContact.notes ?? null,
      })
      .returning();
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(drizzleSql`${contacts.createdAt} DESC`);
  }
}

// Use DatabaseStorage for production
export const storage = new DatabaseStorage();
