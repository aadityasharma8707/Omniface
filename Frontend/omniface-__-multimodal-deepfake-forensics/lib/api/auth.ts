'use client';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'investigator' | 'analyst' | 'admin';
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

const AUTH_KEY = 'omniface_auth_user';
const TOKEN_KEY = 'omniface_auth_token';

export const authService = {
  // Login with credentials
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const name = email.split('@')[0];
    const user: User = {
      id: `usr_${Date.now()}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      role: 'investigator',
      createdAt: new Date().toISOString(),
    };

    const token = `omni_jwt_${btoa(email)}_${Date.now()}`;

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);
    }

    return { success: true, token, user };
  },

  // Register a new user
  register: async (name: string, email: string, password: string, confirmPassword: string): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 650));

    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }

    const user: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email,
      role: 'investigator',
      createdAt: new Date().toISOString(),
    };

    const token = `omni_jwt_${btoa(email)}_${Date.now()}`;

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);
    }

    return { success: true, token, user };
  },

  // Get current logged-in user
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(AUTH_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Logout
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  },
};
