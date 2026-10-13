insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read blog images" on storage.objects;
create policy "Public read blog images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'blog-images');

drop policy if exists "Authenticated upload blog images" on storage.objects;
create policy "Authenticated upload blog images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-images');

drop policy if exists "Authenticated update blog images" on storage.objects;
create policy "Authenticated update blog images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog-images')
  with check (bucket_id = 'blog-images');

drop policy if exists "Authenticated delete blog images" on storage.objects;
create policy "Authenticated delete blog images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog-images');
