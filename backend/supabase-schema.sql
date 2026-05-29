create extension if not exists "pgcrypto";

create type order_status as enum ('Novo', 'Em preparo', 'Saiu para entrega', 'Finalizado');
create type payment_status as enum ('pending', 'approved', 'rejected', 'refunded');

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  address text not null,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null,
  name text not null,
  description text not null,
  price numeric(10, 2) not null check (price >= 0),
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  customer_id uuid not null references public.customers(id),
  status order_status not null default 'Novo',
  payment_method text not null,
  payment_status payment_status not null default 'pending',
  payment_provider text not null default 'mercado_pago',
  provider_payment_id text,
  subtotal numeric(10, 2) not null default 0,
  delivery_fee numeric(10, 2) not null default 0,
  discount numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  notes text,
  print_queued boolean not null default false,
  printed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null,
  total numeric(10, 2) not null
);

create index orders_status_created_idx on public.orders (status, created_at desc);
create index order_items_order_idx on public.order_items (order_id);

alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_items;
