// Supabase Database Operations
// This file contains helper functions for database operations

// Note: supabaseClient is already initialized in supabase-auth.js

// ============================================
// BOOKINGS OPERATIONS
// ============================================

/**
 * Create a new booking
 * @param {Object} bookingData - Booking information
 * @returns {Object} Result with success status and data/error
 */
async function createBooking(bookingData) {
    try {
        const user = await authManager.getCurrentUser();
        if (!user) {
            throw new Error('You must be logged in to create a booking');
        }

        const { data, error } = await supabaseClient
            .from('bookings')
            .insert([
                {
                    user_id: user.id,
                    location_name: bookingData.locationName,
                    check_in_date: bookingData.checkInDate,
                    check_out_date: bookingData.checkOutDate,
                    number_of_guests: bookingData.numberOfGuests,
                    special_requests: bookingData.specialRequests || null,
                    total_amount: bookingData.totalAmount || null,
                    booking_status: 'pending'
                }
            ])
            .select();

        if (error) throw error;

        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error creating booking:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all bookings for the current user
 * @returns {Object} Result with success status and data/error
 */
async function getUserBookings() {
    try {
        const user = await authManager.getCurrentUser();
        if (!user) {
            throw new Error('You must be logged in to view bookings');
        }

        const { data, error } = await supabaseClient
            .from('bookings')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get a specific booking by ID
 * @param {string} bookingId - The booking ID
 * @returns {Object} Result with success status and data/error
 */
async function getBookingById(bookingId) {
    try {
        const { data, error } = await supabaseClient
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching booking:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update a booking
 * @param {string} bookingId - The booking ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Result with success status and data/error
 */
async function updateBooking(bookingId, updates) {
    try {
        const { data, error } = await supabaseClient
            .from('bookings')
            .update(updates)
            .eq('id', bookingId)
            .select();

        if (error) throw error;

        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error updating booking:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Cancel a booking
 * @param {string} bookingId - The booking ID
 * @returns {Object} Result with success status
 */
async function cancelBooking(bookingId) {
    try {
        const { data, error } = await supabaseClient
            .from('bookings')
            .update({ booking_status: 'cancelled' })
            .eq('id', bookingId)
            .select();

        if (error) throw error;

        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete a booking
 * @param {string} bookingId - The booking ID
 * @returns {Object} Result with success status
 */
async function deleteBooking(bookingId) {
    try {
        const { error } = await supabaseClient
            .from('bookings')
            .delete()
            .eq('id', bookingId);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error deleting booking:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// USER PROFILE OPERATIONS
// ============================================

/**
 * Get user profile
 * @returns {Object} Result with success status and data/error
 */
async function getUserProfile() {
    try {
        const user = await authManager.getCurrentUser();
        if (!user) {
            throw new Error('You must be logged in');
        }

        const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching profile:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Create or update user profile
 * @param {Object} profileData - Profile information
 * @returns {Object} Result with success status and data/error
 */
async function upsertUserProfile(profileData) {
    try {
        const user = await authManager.getCurrentUser();
        if (!user) {
            throw new Error('You must be logged in');
        }

        const { data, error } = await supabaseClient
            .from('profiles')
            .upsert({
                id: user.id,
                ...profileData
            })
            .select();

        if (error) throw error;

        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// LOCATIONS OPERATIONS
// ============================================

/**
 * Get all locations
 * @returns {Object} Result with success status and data/error
 */
async function getAllLocations() {
    try {
        const { data, error } = await supabaseClient
            .from('locations')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching locations:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get locations by status (dream, actualized, initiated)
 * @param {string} status - Location status
 * @returns {Object} Result with success status and data/error
 */
async function getLocationsByStatus(status) {
    try {
        const { data, error } = await supabaseClient
            .from('locations')
            .select('*')
            .eq('status', status)
            .order('name', { ascending: true });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching locations:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get a specific location by ID
 * @param {string} locationId - The location ID
 * @returns {Object} Result with success status and data/error
 */
async function getLocationById(locationId) {
    try {
        const { data, error } = await supabaseClient
            .from('locations')
            .select('*')
            .eq('id', locationId)
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching location:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// REAL-TIME SUBSCRIPTIONS (Optional)
// ============================================

/**
 * Subscribe to bookings changes
 * @param {Function} callback - Function to call when bookings change
 * @returns {Object} Subscription object
 */
function subscribeToBookings(callback) {
    return supabaseClient
        .channel('bookings-channel')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'bookings'
            },
            callback
        )
        .subscribe();
}

/**
 * Unsubscribe from a channel
 * @param {Object} subscription - The subscription object
 */
function unsubscribe(subscription) {
    supabaseClient.removeChannel(subscription);
}
