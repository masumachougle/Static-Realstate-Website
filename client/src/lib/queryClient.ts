import { QueryClient, QueryFunction } from "@tanstack/react-query";
import * as api from "./supabaseApi";

function parseUrl(url: string): {
  resource: string;
  id?: string;
  action?: string;
  search: URLSearchParams;
} {
  const [withoutQuery, query = ""] = url.split("?");
  const parts = withoutQuery.replace(/^\//, "").split("/").filter(Boolean);
  // api / resource / id? / action?
  return {
    resource: parts[1] ?? "",
    id: parts[2],
    action: parts[3],
    search: new URLSearchParams(query),
  };
}

function normalizeQueryUrl(queryKey: readonly unknown[]): string {
  if (queryKey.length > 1 && !String(queryKey[0]).includes("?")) {
    const url = queryKey.map(String).join("/");
    return url.startsWith("/") ? url : `/${url}`;
  }
  const url = String(queryKey[0] ?? "");
  return url.startsWith("/") ? url : `/${url}`;
}

async function handleGet(url: string): Promise<unknown> {
  const { resource, id, search } = parseUrl(url);

  if (resource === "properties" && !id) {
    const filters: {
      propertyType?: string;
      location?: string;
      minPrice?: number;
      maxPrice?: number;
      bedrooms?: number;
    } = {};
    const propertyType = search.get("propertyType");
    const location = search.get("location");
    const minPrice = search.get("minPrice");
    const maxPrice = search.get("maxPrice");
    const bedrooms = search.get("bedrooms");
    if (propertyType) filters.propertyType = propertyType;
    if (location) filters.location = location;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (bedrooms) filters.bedrooms = parseInt(bedrooms, 10);
    return api.getProperties(filters);
  }

  if (resource === "properties" && id) {
    return api.getPropertyById(id);
  }

  if (resource === "blog" && !id) return api.getBlogPosts();
  if (resource === "blog" && id) return api.getBlogPostById(id);

  if (resource === "contacts") return api.getContacts();
  if (resource === "users" && id === "me") return api.getCurrentUser();
  if (resource === "users" && !id) return api.getUsers();

  throw new Error(`Unknown GET route: ${url}`);
}

async function handleMutation(
  method: string,
  url: string,
  data?: unknown,
): Promise<unknown> {
  const { resource, id, action } = parseUrl(url);
  const body = (data ?? {}) as Record<string, unknown>;

  if (resource === "properties") {
    if (method === "POST" && !id) return api.createProperty(body as never);
    if (method === "PUT" && id) return api.updateProperty(id, body as never);
    if (method === "DELETE" && id) {
      await api.deleteProperty(id);
      return null;
    }
  }

  if (resource === "blog") {
    if (method === "POST" && !id) return api.createBlogPost(body as never);
    if (method === "PUT" && id) return api.updateBlogPost(id, body as never);
    if (method === "DELETE" && id) {
      await api.deleteBlogPost(id);
      return null;
    }
  }

  if (resource === "contact" && method === "POST") {
    return api.createContact(body as never);
  }

  if (resource === "users") {
    if (method === "POST" && !id) return api.createUser(body as never);
    if (method === "PUT" && id && id !== "change-password") {
      return api.updateUser(id, body as never);
    }
    if (method === "DELETE" && id) {
      await api.deleteUser(id);
      return null;
    }
    if (method === "POST" && id === "change-password") {
      await api.changePassword(
        String(body.currentPassword ?? ""),
        String(body.newPassword ?? ""),
      );
      return { message: "Password updated successfully" };
    }
    if (method === "POST" && action === "reset-password" && id) {
      await api.resetUserPassword(id, String(body.newPassword ?? ""));
      return { message: "Password reset successfully" };
    }
  }

  throw new Error(`Unknown ${method} route: ${url}`);
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const result = await handleMutation(method.toUpperCase(), url, data);
  const isDelete = method.toUpperCase() === "DELETE";
  return new Response(isDelete ? null : JSON.stringify(result ?? {}), {
    status: method.toUpperCase() === "POST" ? 201 : isDelete ? 204 : 200,
    headers: { "Content-Type": "application/json" },
  });
}

type UnauthorizedBehavior = "returnNull" | "throw";

export function getQueryFn<T>(options: {
  on401: UnauthorizedBehavior;
}): QueryFunction<T> {
  const { on401: unauthorizedBehavior } = options;
  return async ({ queryKey }) => {
    try {
      const url = normalizeQueryUrl(queryKey);
      return (await handleGet(url)) as T;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (unauthorizedBehavior === "returnNull" && message.includes("401")) {
        return null as T;
      }
      throw err;
    }
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
