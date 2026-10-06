-- Enable RLS and public/authenticated policies for browser Supabase access.
-- Run this in the Supabase SQL editor (or via supabase db push).

-- Resolve username -> email for login (security definer, returns email only)
create or replace function public.resolve_login_email(identifier text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved text;
begin
  if identifier is null or length(trim(identifier)) = 0 then
    return null;
  end if;

  if position('@' in identifier) > 0 then
    return lower(trim(identifier));
  end if;

  select lower(email) into resolved
  from public.users
  where username = trim(identifier)
  limit 1;

  return resolved;
end;
$$;

grant execute on function public.resolve_login_email(text) to anon, authenticated;

-- PROPERTIES
alter table public.properties enable row level security;

drop policy if exists "Public can read properties" on public.properties;
create policy "Public can read properties"
  on public.properties for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can insert properties" on public.properties;
create policy "Authenticated can insert properties"
  on public.properties for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update properties" on public.properties;
create policy "Authenticated can update properties"
  on public.properties for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete properties" on public.properties;
create policy "Authenticated can delete properties"
  on public.properties for delete
  to authenticated
  using (true);

-- BLOG POSTS
alter table public.blog_posts enable row level security;

drop policy if exists "Public can read blog posts" on public.blog_posts;
create policy "Public can read blog posts"
  on public.blog_posts for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can insert blog posts" on public.blog_posts;
create policy "Authenticated can insert blog posts"
  on public.blog_posts for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update blog posts" on public.blog_posts;
create policy "Authenticated can update blog posts"
  on public.blog_posts for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete blog posts" on public.blog_posts;
create policy "Authenticated can delete blog posts"
  on public.blog_posts for delete
  to authenticated
  using (true);

-- CONTACTS
alter table public.contacts enable row level security;

drop policy if exists "Public can insert contacts" on public.contacts;
create policy "Public can insert contacts"
  on public.contacts for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated can read contacts" on public.contacts;
create policy "Authenticated can read contacts"
  on public.contacts for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can delete contacts" on public.contacts;
create policy "Authenticated can delete contacts"
  on public.contacts for delete
  to authenticated
  using (true);

-- USERS (profiles / permissions)
alter table public.users enable row level security;

drop policy if exists "Authenticated can read users" on public.users;
create policy "Authenticated can read users"
  on public.users for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can update users" on public.users;
create policy "Authenticated can update users"
  on public.users for update
  to authenticated
  using (true)
  with check (true);

-- Inserts/deletes for users go through the manage-user edge function (service role)
