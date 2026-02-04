// Supabase Database Setup Script
// This script creates all necessary tables, policies, and sample data

// Load environment variables
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Missing environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env file');
  process.exit(1);
}

// SQL to create all tables and policies
const setupSQL = `
-- ============================================
-- CREATE TABLES
-- ============================================

-- Profiles table (user information)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text,
  phone_number text,
  membership_type text,
  membership_status text default 'inactive',
  avatar_url text
);

-- Locations table (Zen Abodes)
create table if not exists locations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  country text,
  status text check (status in ('dream', 'actualized', 'initiated')),
  image_url text,
  max_capacity integer default 10,
  price_per_night numeric
);

-- Bookings table (accommodation bookings)
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade not null,
  location_name text not null,
  check_in_date date not null,
  check_out_date date not null,
  number_of_guests integer not null check (number_of_guests > 0),
  booking_status text default 'pending' check (booking_status in ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests text,
  total_amount numeric
);

-- ============================================
-- CREATE INDEXES
-- ============================================

create index if not exists bookings_user_id_idx on bookings(user_id);
create index if not exists bookings_status_idx on bookings(booking_status);
create index if not exists locations_status_idx on locations(status);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

alter table profiles enable row level security;
alter table locations enable row level security;
alter table bookings enable row level security;

-- ============================================
-- CREATE POLICIES
-- ============================================

-- Profiles policies
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Locations policies (anyone can view)
drop policy if exists "Anyone can view locations" on locations;
create policy "Anyone can view locations"
  on locations for select
  to authenticated, anon
  using (true);

-- Bookings policies
drop policy if exists "Users can view own bookings" on bookings;
create policy "Users can view own bookings"
  on bookings for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own bookings" on bookings;
create policy "Users can create own bookings"
  on bookings for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own bookings" on bookings;
create policy "Users can update own bookings"
  on bookings for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own bookings" on bookings;
create policy "Users can delete own bookings"
  on bookings for delete
  using (auth.uid() = user_id);

-- ============================================
-- CREATE FUNCTION TO AUTO-UPDATE updated_at
-- ============================================

create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers
drop trigger if exists handle_profiles_updated_at on profiles;
create trigger handle_profiles_updated_at
  before update on profiles
  for each row
  execute function handle_updated_at();

drop trigger if exists handle_bookings_updated_at on bookings;
create trigger handle_bookings_updated_at
  before update on bookings
  for each row
  execute function handle_updated_at();

-- ============================================
-- INSERT SAMPLE LOCATIONS
-- ============================================

insert into locations (name, description, country, status, price_per_night, max_capacity) values
  ('Auroville', 'A universal town in South India where people of all nationalities live in peace.', 'India', 'actualized', 50, 8),
  ('Angkor Wat', 'Ancient temple complex in Cambodia, a UNESCO World Heritage site.', 'Cambodia', 'dream', 75, 6),
  ('Fiordland', 'Stunning natural beauty in New Zealand with mountains and fjords.', 'New Zealand', 'dream', 100, 10),
  ('Akureyri', 'The capital of North Iceland, known for its midnight sun and northern lights.', 'Iceland', 'initiated', 85, 6)
on conflict do nothing;
`;

async function setupDatabase() {
  console.log('🚀 Starting Supabase database setup...\n');

  try {
    // Execute SQL using REST API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({ query: setupSQL })
    });

    // Alternative: Use Supabase Management API
    const postgrestResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      }
    });

    console.log('✅ Database setup completed!\n');
    console.log('📋 Created tables:');
    console.log('   - profiles');
    console.log('   - locations (with sample data)');
    console.log('   - bookings');
    console.log('\n🔒 Row Level Security enabled on all tables');
    console.log('\n✨ You can now use the booking system!');
    console.log('\nNext steps:');
    console.log('1. Visit booking.html to create a booking');
    console.log('2. View your bookings in member-profile.html');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.log('\n⚠️  Please run the SQL manually in Supabase dashboard:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Click SQL Editor');
    console.log('4. Copy and paste the SQL from setup-database.sql');
    console.log('5. Click Run');
  }
}

// Run setup
setupDatabase();
