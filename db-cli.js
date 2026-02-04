#!/usr/bin/env node

// Supabase Database CLI Tool
// Read/Write database operations using Service Role Key

// Load environment variables from .env file
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Validate required environment variables
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Error: Missing required environment variables');
    console.error('Please create a .env file with:');
    console.error('  SUPABASE_URL=your_project_url');
    console.error('  SUPABASE_SERVICE_KEY=your_service_role_key');
    console.error('\nSee .env.example for a template');
    process.exit(1);
}

// Helper function to make API calls
async function supabaseQuery(method, endpoint, data = null) {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;

    const options = {
        method,
        headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
    };

    if (data && (method === 'POST' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(`API Error: ${JSON.stringify(result)}`);
    }

    return result;
}

// Execute SQL query
async function executeSql(query) {
    const url = `${SUPABASE_URL}/rest/v1/rpc/exec`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    });

    return await response.json();
}

// Commands
const commands = {
    // List all bookings
    async listBookings() {
        console.log('📋 Fetching all bookings...\n');
        const bookings = await supabaseQuery('GET', 'bookings?select=*');

        if (bookings.length === 0) {
            console.log('No bookings found.');
        } else {
            bookings.forEach(booking => {
                console.log(`ID: ${booking.id}`);
                console.log(`Location: ${booking.location_name}`);
                console.log(`Dates: ${booking.check_in_date} to ${booking.check_out_date}`);
                console.log(`Guests: ${booking.number_of_guests}`);
                console.log(`Status: ${booking.booking_status}`);
                console.log('---');
            });
        }
        console.log(`\nTotal: ${bookings.length} bookings`);
    },

    // List all locations
    async listLocations() {
        console.log('🌍 Fetching all locations...\n');
        const locations = await supabaseQuery('GET', 'locations?select=*');

        locations.forEach(loc => {
            console.log(`${loc.name} (${loc.country})`);
            console.log(`  Status: ${loc.status}`);
            console.log(`  Price: $${loc.price_per_night}/night`);
            console.log(`  Capacity: ${loc.max_capacity} guests`);
            console.log('');
        });
    },

    // List all profiles
    async listProfiles() {
        console.log('👥 Fetching all user profiles...\n');
        const profiles = await supabaseQuery('GET', 'profiles?select=*');

        if (profiles.length === 0) {
            console.log('No profiles found.');
        } else {
            profiles.forEach(profile => {
                console.log(`User ID: ${profile.id}`);
                console.log(`Name: ${profile.full_name || 'N/A'}`);
                console.log(`Phone: ${profile.phone_number || 'N/A'}`);
                console.log(`Membership: ${profile.membership_type || 'N/A'} (${profile.membership_status})`);
                console.log('---');
            });
        }
    },

    // Add a new location
    async addLocation(name, country, status, description = '', price = 0, capacity = 10) {
        console.log(`➕ Adding location: ${name}...\n`);

        const newLocation = await supabaseQuery('POST', 'locations', {
            name,
            country,
            status,
            description,
            price_per_night: price,
            max_capacity: capacity
        });

        console.log('✅ Location added successfully!');
        console.log(JSON.stringify(newLocation, null, 2));
    },

    // Update booking status
    async updateBookingStatus(bookingId, newStatus) {
        console.log(`🔄 Updating booking ${bookingId} to ${newStatus}...\n`);

        const updated = await supabaseQuery('PATCH', `bookings?id=eq.${bookingId}`, {
            booking_status: newStatus
        });

        console.log('✅ Booking updated successfully!');
        console.log(JSON.stringify(updated, null, 2));
    },

    // Get database statistics
    async stats() {
        console.log('📊 Database Statistics\n');

        const bookings = await supabaseQuery('GET', 'bookings?select=count');
        const profiles = await supabaseQuery('GET', 'profiles?select=count');
        const locations = await supabaseQuery('GET', 'locations?select=count');

        console.log(`Bookings: ${bookings.length || 0}`);
        console.log(`Profiles: ${profiles.length || 0}`);
        console.log(`Locations: ${locations.length || 0}`);
    }
};

// Main CLI handler
async function main() {
    const command = process.argv[2];
    const args = process.argv.slice(3);

    try {
        switch (command) {
            case 'list-bookings':
                await commands.listBookings();
                break;

            case 'list-locations':
                await commands.listLocations();
                break;

            case 'list-profiles':
                await commands.listProfiles();
                break;

            case 'add-location':
                if (args.length < 3) {
                    console.log('Usage: node db-cli.js add-location <name> <country> <status> [description] [price] [capacity]');
                    process.exit(1);
                }
                await commands.addLocation(...args);
                break;

            case 'update-booking':
                if (args.length < 2) {
                    console.log('Usage: node db-cli.js update-booking <booking-id> <new-status>');
                    process.exit(1);
                }
                await commands.updateBookingStatus(args[0], args[1]);
                break;

            case 'stats':
                await commands.stats();
                break;

            default:
                console.log('Supabase Database CLI Tool\n');
                console.log('Available commands:');
                console.log('  list-bookings              - List all bookings');
                console.log('  list-locations             - List all locations');
                console.log('  list-profiles              - List all user profiles');
                console.log('  add-location <name> <country> <status> [description] [price] [capacity]');
                console.log('  update-booking <id> <status> - Update booking status');
                console.log('  stats                      - Show database statistics');
                console.log('\nExample:');
                console.log('  node db-cli.js list-locations');
                console.log('  node db-cli.js add-location "Bali" "Indonesia" "dream" "Beautiful beaches" 65 12');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
