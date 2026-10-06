import "./envSetup.js";
import { db } from "./db";
import { properties } from "@shared/schema";

try {
  const rows = await db.select().from(properties);
  console.log("OK", rows.length);
} catch (error) {
  console.error("ERROR:", error instanceof Error ? error.message : error);
  process.exit(1);
}
