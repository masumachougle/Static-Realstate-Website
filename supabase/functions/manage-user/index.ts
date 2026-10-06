import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type UserPayload = {
  username: string;
  password?: string;
  email?: string | null;
  name?: string | null;
  role?: string;
  isAdmin?: boolean;
  canManageProperties?: boolean;
  canManageBlogs?: boolean;
  canViewLeads?: boolean;
};

function toCamelUser(row: Record<string, unknown>) {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    name: row.name,
    role: row.role,
    isAdmin: row.is_admin,
    canManageProperties: row.can_manage_properties,
    canManageBlogs: row.can_manage_blogs,
    canViewLeads: row.can_view_leads,
    createdAt: row.created_at,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user: caller },
      error: callerError,
    } = await callerClient.auth.getUser();
    if (callerError || !caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);

    const { data: callerProfile } = await admin
      .from("users")
      .select("is_admin")
      .or(
        caller.email
          ? `email.eq.${caller.email},id.eq.${caller.id}`
          : `id.eq.${caller.id}`,
      )
      .maybeSingle();

    if (!callerProfile?.is_admin) {
      return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const action = body.action as string;

    if (action === "create") {
      const user = body.user as UserPayload;
      if (!user?.username || !user?.password) {
        return new Response(JSON.stringify({ error: "Username and password are required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const email =
        user.email?.trim() ||
        `${user.username.replace(/[^a-zA-Z0-9._-]/g, "")}@users.local`;

      const { data: authData, error: authError } = await admin.auth.admin.createUser({
        email,
        password: user.password,
        email_confirm: true,
        user_metadata: { username: user.username },
      });
      if (authError) {
        return new Response(JSON.stringify({ error: authError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: profile, error: profileError } = await admin
        .from("users")
        .insert({
          id: authData.user.id,
          username: user.username,
          password: "supabase-auth",
          email,
          name: user.name ?? null,
          role: user.role ?? "user",
          is_admin: user.isAdmin ?? false,
          can_manage_properties: user.canManageProperties ?? false,
          can_manage_blogs: user.canManageBlogs ?? false,
          can_view_leads: user.canViewLeads ?? false,
        })
        .select(
          "id, username, email, name, role, is_admin, can_manage_properties, can_manage_blogs, can_view_leads, created_at",
        )
        .single();

      if (profileError) {
        await admin.auth.admin.deleteUser(authData.user.id);
        return new Response(JSON.stringify({ error: profileError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ user: toCamelUser(profile) }), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const id = body.id as string;
      if (!id) {
        return new Response(JSON.stringify({ error: "User id is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (id === caller.id) {
        return new Response(JSON.stringify({ error: "Cannot delete your own account" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await admin.from("users").delete().eq("id", id);
      await admin.auth.admin.deleteUser(id);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "reset-password") {
      const id = body.id as string;
      const newPassword = body.newPassword as string;
      if (!id || !newPassword || newPassword.length < 6) {
        return new Response(JSON.stringify({ error: "Invalid request data" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await admin.auth.admin.updateUserById(id, {
        password: newPassword,
      });
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ message: "Password reset successfully" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
