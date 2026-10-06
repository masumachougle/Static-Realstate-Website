import { requireSupabase } from "./supabase";
import {
  rowToCamel,
  rowsToCamel,
  toSnakePayload,
  type BlogPostRow,
  type ContactRow,
  type PropertyRow,
  type UserRow,
} from "./mappers";
import type {
  InsertBlogPost,
  InsertContact,
  InsertProperty,
  InsertUser,
} from "@shared/schema";

function supabase() {
  return requireSupabase();
}

function throwOnError(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase().auth.getUser();
  throwOnError(error);
  if (!data.user) throw new Error("401: Not authenticated");
  return data.user.id;
}

async function getProfileByAuth(): Promise<UserRow> {
  const {
    data: { user },
    error: authError,
  } = await supabase().auth.getUser();
  throwOnError(authError);
  if (!user) throw new Error("401: Not authenticated");

  // Prefer matching by auth user id (profiles created via manage-user)
  let { data, error } = await supabase()
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  throwOnError(error);

  if (!data && user.email) {
    const byEmail = await supabase()
      .from("users")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();
    throwOnError(byEmail.error);
    data = byEmail.data;
  }

  if (!data) {
    const username = user.user_metadata?.username as string | undefined;
    if (username) {
      const byUsername = await supabase()
        .from("users")
        .select("*")
        .eq("username", username)
        .maybeSingle();
      throwOnError(byUsername.error);
      data = byUsername.data;
    }
  }

  if (!data) throw new Error("401: User profile not found");

  const profile = rowToCamel<UserRow>(data);
  const { password: _pw, ...safe } = profile;
  return safe;
}

export async function getProperties(filters?: {
  propertyType?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
}): Promise<PropertyRow[]> {
  let query = supabase().from("properties").select("*");

  if (filters?.propertyType && filters.propertyType !== "all") {
    query = query.ilike("property_type", filters.propertyType);
  }
  if (filters?.location && filters.location !== "all") {
    query = query.ilike("location", `%${filters.location}%`);
  }
  if (filters?.minPrice != null) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters?.maxPrice != null) {
    query = query.lte("price", filters.maxPrice);
  }
  if (filters?.bedrooms != null) {
    query = query.gte("bedrooms", filters.bedrooms);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  throwOnError(error);
  return rowsToCamel<PropertyRow>(data);
}

export async function getPropertyById(id: string): Promise<PropertyRow> {
  const { data, error } = await supabase()
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  throwOnError(error);
  if (!data) throw new Error("404: Property not found");
  return rowToCamel<PropertyRow>(data);
}

export async function createProperty(
  payload: InsertProperty,
): Promise<PropertyRow> {
  await requireUserId();
  const { data, error } = await supabase()
    .from("properties")
    .insert(toSnakePayload(payload as Record<string, unknown>))
    .select("*")
    .single();
  throwOnError(error);
  return rowToCamel<PropertyRow>(data);
}

export async function updateProperty(
  id: string,
  payload: Partial<InsertProperty>,
): Promise<PropertyRow> {
  await requireUserId();
  const { data, error } = await supabase()
    .from("properties")
    .update({
      ...toSnakePayload(payload as Record<string, unknown>),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();
  throwOnError(error);
  return rowToCamel<PropertyRow>(data);
}

export async function deleteProperty(id: string): Promise<void> {
  await requireUserId();
  const { error } = await supabase().from("properties").delete().eq("id", id);
  throwOnError(error);
}

export async function getBlogPosts(): Promise<BlogPostRow[]> {
  const { data, error } = await supabase().from("blog_posts").select("*");
  throwOnError(error);
  return rowsToCamel<BlogPostRow>(data);
}

export async function getBlogPostById(id: string): Promise<BlogPostRow> {
  const { data, error } = await supabase()
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  throwOnError(error);
  if (!data) throw new Error("404: Blog post not found");
  return rowToCamel<BlogPostRow>(data);
}

export async function createBlogPost(
  payload: InsertBlogPost,
): Promise<BlogPostRow> {
  await requireUserId();
  const { data, error } = await supabase()
    .from("blog_posts")
    .insert(toSnakePayload(payload as Record<string, unknown>))
    .select("*")
    .single();
  throwOnError(error);
  return rowToCamel<BlogPostRow>(data);
}

export async function updateBlogPost(
  id: string,
  payload: Partial<InsertBlogPost>,
): Promise<BlogPostRow> {
  await requireUserId();
  const { data, error } = await supabase()
    .from("blog_posts")
    .update(toSnakePayload(payload as Record<string, unknown>))
    .eq("id", id)
    .select("*")
    .single();
  throwOnError(error);
  return rowToCamel<BlogPostRow>(data);
}

export async function deleteBlogPost(id: string): Promise<void> {
  await requireUserId();
  const { error } = await supabase().from("blog_posts").delete().eq("id", id);
  throwOnError(error);
}

export async function createContact(
  payload: InsertContact,
): Promise<ContactRow> {
  // Insert without .select() — anon has INSERT but not SELECT on contacts.
  // Returning rows would fail RLS even when the insert succeeds.
  const { error } = await supabase()
    .from("contacts")
    .insert(
      toSnakePayload(payload as Record<string, unknown>, {
        omit: ["id", "createdAt"],
      }),
    );
  throwOnError(error);

  const contact = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    propertyInterest: payload.propertyInterest ?? null,
    propertyId: payload.propertyId ?? null,
    propertyTitle: payload.propertyTitle ?? null,
    preferredDate: payload.preferredDate ?? null,
    preferredTime: payload.preferredTime ?? null,
    notes: payload.notes ?? null,
  } as ContactRow;

  const { error: emailError } = await supabase().functions.invoke(
    "send-contact-email",
    { body: contact },
  );
  if (emailError) {
    console.error("Failed to send contact notification email:", emailError);
  }

  return contact;
}

export async function getContacts(): Promise<ContactRow[]> {
  await requireUserId();
  const { data, error } = await supabase()
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });
  throwOnError(error);
  return rowsToCamel<ContactRow>(data);
}

export async function getUsers(): Promise<UserRow[]> {
  await requireUserId();
  const { data, error } = await supabase()
    .from("users")
    .select(
      "id, username, email, name, role, is_admin, can_manage_properties, can_manage_blogs, can_view_leads, created_at",
    )
    .order("created_at", { ascending: false });
  throwOnError(error);
  return rowsToCamel<UserRow>(data);
}

export async function getCurrentUser(): Promise<UserRow> {
  return getProfileByAuth();
}

export async function createUser(payload: InsertUser): Promise<UserRow> {
  await requireUserId();
  const { data, error } = await supabase().functions.invoke("manage-user", {
    body: { action: "create", user: payload },
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data.user as UserRow;
}

export async function updateUser(
  id: string,
  payload: Partial<InsertUser>,
): Promise<UserRow> {
  await requireUserId();
  const { password: _password, ...safePayload } = payload;
  const { data, error } = await supabase()
    .from("users")
    .update(toSnakePayload(safePayload as Record<string, unknown>))
    .eq("id", id)
    .select(
      "id, username, email, name, role, is_admin, can_manage_properties, can_manage_blogs, can_view_leads, created_at",
    )
    .single();
  throwOnError(error);
  return rowToCamel<UserRow>(data);
}

export async function deleteUser(id: string): Promise<void> {
  await requireUserId();
  const { data, error } = await supabase().functions.invoke("manage-user", {
    body: { action: "delete", id },
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase().auth.getUser();
  throwOnError(userError);
  if (!user?.email) throw new Error("Not authenticated");

  const { error: reauthError } = await supabase().auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (reauthError) throw new Error("Current password is incorrect");

  const { error } = await supabase().auth.updateUser({ password: newPassword });
  throwOnError(error);
}

export async function resetUserPassword(
  id: string,
  newPassword: string,
): Promise<void> {
  await requireUserId();
  const { data, error } = await supabase().functions.invoke("manage-user", {
    body: { action: "reset-password", id, newPassword },
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
}

export async function loginWithIdentifier(
  identifier: string,
  password: string,
): Promise<UserRow> {
  const trimmed = identifier.trim();
  let email = trimmed.includes("@") ? trimmed.toLowerCase() : "";

  if (!email) {
    const { data: resolvedEmail, error: resolveError } = await supabase().rpc(
      "resolve_login_email",
      { identifier: trimmed },
    );
    if (!resolveError && resolvedEmail) {
      email = String(resolvedEmail).trim();
    }
  }

  if (!email) {
    throw new Error("Invalid username or password");
  }

  const { error } = await supabase().auth.signInWithPassword({ email, password });
  if (error) throw new Error("Invalid username or password");

  return getProfileByAuth();
}

export async function logout(): Promise<void> {
  const { error } = await supabase().auth.signOut();
  throwOnError(error);
}

export async function checkAuth(): Promise<boolean> {
  const { data } = await supabase().auth.getSession();
  return !!data.session;
}
