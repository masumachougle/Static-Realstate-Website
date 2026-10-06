import type {
  BlogPost,
  Contact,
  InsertBlogPost,
  InsertContact,
  InsertProperty,
  InsertUser,
  Property,
  User,
} from "@shared/schema";

type SnakeKeys = Record<string, unknown>;

function toCamelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

function toSnakeKey(key: string): string {
  return key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

export function rowsToCamel<T>(rows: SnakeKeys[] | null | undefined): T[] {
  if (!rows) return [];
  return rows.map((row) => rowToCamel<T>(row));
}

export function rowToCamel<T>(row: SnakeKeys | null | undefined): T {
  if (!row) return row as T;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    out[toCamelKey(key)] = value;
  }
  return out as T;
}

export function toSnakePayload(
  data: Record<string, unknown>,
  options?: { omit?: string[] },
): SnakeKeys {
  const omit = new Set(options?.omit ?? []);
  const out: SnakeKeys = {};
  for (const [key, value] of Object.entries(data)) {
    if (omit.has(key) || value === undefined) continue;
    out[toSnakeKey(key)] = value;
  }
  return out;
}

export type PropertyRow = Property;
export type BlogPostRow = BlogPost;
export type ContactRow = Contact;
export type UserRow = Omit<User, "password"> & { password?: string };

export type PropertyInsert = InsertProperty;
export type BlogPostInsert = InsertBlogPost;
export type ContactInsert = InsertContact;
export type UserInsert = InsertUser;
