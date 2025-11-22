-- 1. Create the workflows table
create table if not exists public.workflows (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  status text default 'draft' not null check (status in ('draft', 'published', 'archived')),
  graph jsonb default '{}'::jsonb not null,
  inngest_trigger text
);

-- 2. Enable Row Level Security (RLS)
-- This is crucial so users can only see their own data
alter table public.workflows enable row level security;

-- 3. Create Access Policies

-- Allow users to view their own workflows
create policy "Users can view own workflows" 
on public.workflows for select 
using (auth.uid() = user_id);

-- Allow users to insert their own workflows
create policy "Users can insert own workflows" 
on public.workflows for insert 
with check (auth.uid() = user_id);

-- Allow users to update their own workflows
create policy "Users can update own workflows" 
on public.workflows for update 
using (auth.uid() = user_id);

-- Allow users to delete their own workflows
create policy "Users can delete own workflows" 
on public.workflows for delete 
using (auth.uid() = user_id);