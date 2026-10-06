import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  name: text("name"),
  role: text("role").default("user").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  // Granular permissions
  canManageProperties: boolean("can_manage_properties").default(false).notNull(),
  canManageBlogs: boolean("can_manage_blogs").default(false).notNull(),
  canViewLeads: boolean("can_view_leads").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  propertyType: text("property_type").notNull(),
  location: text("location").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  size: integer("size"),
  images: text("images").array().notNull(),
  featured: text("featured").default('false'),
  amenities: text("amenities").array(),
  status: text("status").default('available'),
  // Additional fields for enterprise property management
  referenceNumber: text("reference_number"),
  virtualTourUrl: text("virtual_tour_url"),
  videoUrl: text("video_url"),
  yearBuilt: integer("year_built"),
  parkingSpaces: integer("parking_spaces"),
  floorNumber: integer("floor_number"),
  totalFloors: integer("total_floors"),
  viewType: text("view_type"),
  furnishing: text("furnishing"),
  ownership: text("ownership"),
  serviceCharge: decimal("service_charge", { precision: 10, scale: 2 }),
  developer: text("developer"),
  projectName: text("project_name"),
  handoverDate: text("handover_date"),
  roi: decimal("roi", { precision: 5, scale: 2 }),
  pricePerSqft: decimal("price_per_sqft", { precision: 10, scale: 2 }),
  plotSize: integer("plot_size"),
  agentNotes: text("agent_notes"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  date: text("date").notNull(),
  image: text("image").notNull(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  propertyInterest: text("property_interest"),
  message: text("message").notNull(),
  propertyId: varchar("property_id"),
  propertyTitle: text("property_title"),
  preferredDate: text("preferred_date"),
  preferredTime: text("preferred_time"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });

export const insertPropertySchema = createInsertSchema(properties).omit({ id: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true });
export const insertContactSchema = createInsertSchema(contacts)
  .omit({ id: true, createdAt: true })
  .superRefine((data, ctx) => {
    if (data.propertyInterest === "viewing") {
      if (!data.preferredDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Preferred date is required for viewing requests",
          path: ["preferredDate"],
        });
      }
      if (!data.preferredTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Preferred time is required for viewing requests",
          path: ["preferredTime"],
        });
      }
      if (!data.propertyId && !data.propertyTitle) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Property is required for viewing requests",
          path: ["propertyTitle"],
        });
      }
    }
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
