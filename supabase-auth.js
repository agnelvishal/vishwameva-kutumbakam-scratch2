// Supabase Configuration
// Use environment variables if available, otherwise use hardcoded values (for browser compatibility)
const SUPABASE_URL = typeof process !== 'undefined' && process.env?.SUPABASE_URL
    ? process.env.SUPABASE_URL
    : 'https://pnmhvwhyjbyequlonqzy.supabase.co';
const SUPABASE_ANON_KEY = typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY
    ? process.env.SUPABASE_ANON_KEY
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBubWh2d2h5amJ5ZXF1bG9ucXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODE3NzMsImV4cCI6MjA4NTQ1Nzc3M30.YgdZ0vnrAo58za7F-RMRF8FTL8yoMn-bU33F8jLTDcE';

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth State Management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Check for existing session
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            this.currentUser = session.user;
            this.updateAuthUI();
        }

        // Listen for auth state changes
        supabaseClient.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event);
            this.currentUser = session?.user || null;
            this.updateAuthUI();

            // Handle different auth events
            if (event === 'SIGNED_IN') {
                this.onSignIn(session.user);
            } else if (event === 'SIGNED_OUT') {
                this.onSignOut();
            }
        });
    }

    updateAuthUI() {
        // Update sign-in button in header
        const signInBtn = document.querySelector('.sign-in-btn');
        if (signInBtn) {
            if (this.currentUser) {
                signInBtn.textContent = 'Profile';
                signInBtn.onclick = () => window.location.href = 'member-profile.html';
            } else {
                signInBtn.textContent = 'Sign In';
                signInBtn.onclick = () => window.location.href = 'member-login.html';
            }
        }
    }

    onSignIn(user) {
        console.log('User signed in:', user.email);

        // Redirect to profile page if on login page
        if (window.location.pathname.includes('member-login.html')) {
            window.location.href = 'member-profile.html';
        }
    }

    onSignOut() {
        console.log('User signed out');

        // Redirect to login page if on profile page
        if (window.location.pathname.includes('member-profile.html')) {
            window.location.href = 'member-login.html';
        }
    }

    // Sign up with email and password
    async signUp(email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
            });

            if (error) throw error;

            return { success: true, data, message: 'Sign up successful! Please check your email to confirm your account.' };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign in with email and password
    async signIn(email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign in with Google
    async signInWithGoogle() {
        try {
            const { data, error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'https://vishwamevakutumbak2.netlify.app/member-profile.html'
                }
            });

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Google sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign in with Facebook
    async signInWithFacebook() {
        try {
            const { data, error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'facebook',
                options: {
                    redirectTo: 'https://vishwamevakutumbak2.netlify.app/member-profile.html'
                }
            });

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Facebook sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign out
    async signOut() {
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    // Reset password
    async resetPassword(email) {
        try {
            const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://vishwamevakutumbak2.netlify.app/member-login.html',
            });

            if (error) throw error;

            return { success: true, message: 'Password reset email sent! Check your inbox.' };
        } catch (error) {
            console.error('Reset password error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get current user
    async getCurrentUser() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        return user;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }
}

// Initialize the auth manager globally
const authManager = new AuthManager();

// Helper function to show messages
function showMessage(message, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${isError ? '#f44336' : '#4CAF50'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
