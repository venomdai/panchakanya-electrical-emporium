-- Panchakanya Electric Emporium - Supabase schema
-- Run this once in: Supabase Dashboard -> SQL Editor -> New query -> Run

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists public.products (
  id             text primary key,
  name           text not null,
  brand          text,
  category       text,
  category_group text,
  model          text,
  price          numeric,
  original_price numeric,
  stock          integer,
  rating         numeric,
  review_count   integer,
  in_stock       boolean default true,
  new_arrival    boolean default false,
  featured       boolean default false,
  best_seller    boolean default false,
  images         jsonb default '[]'::jsonb,
  description    text,
  features       jsonb default '[]'::jsonb,
  specs          jsonb default '{}'::jsonb,
  warranty       text,
  delivery       text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

alter table public.products enable row level security;

create policy "Products: public read"       on public.products for select using (true);
create policy "Products: public insert"     on public.products for insert with check (true);
create policy "Products: public update"     on public.products for update using (true) with check (true);
create policy "Products: public delete"     on public.products for delete using (true);

grant select, insert, update, delete on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;

-- ============================================================
-- SITE CONTENT  (single row, id = 'main')
-- ============================================================
create table if not exists public.site_content (
  id         text primary key default 'main',
  phone      text,
  whatsapp   text,
  email      text,
  location   text,
  hours      text,
  about      text,
  updated_at timestamptz default now()
);

alter table public.site_content enable row level security;

create policy "Site content: public read"   on public.site_content for select using (true);
create policy "Site content: public insert" on public.site_content for insert with check (true);
create policy "Site content: public update" on public.site_content for update using (true) with check (true);
create policy "Site content: public delete" on public.site_content for delete using (true);

grant select, insert, update, delete on public.site_content to anon;
grant select, insert, update, delete on public.site_content to authenticated;

-- After running: The site will automatically upload your current catalog the
-- first time it loads. No manual data entry needed.