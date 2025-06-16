import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project credentials
// You can find these in your Supabase project settings
const supabaseUrl = 'https://chucdxhqzoxmtrxpavga.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNodWNkeGhxem94bXRyeHBhdmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzI4NDcsImV4cCI6MjA2NTE0ODg0N30._lL6Hf94_aRCuZSLHcxZ1CwqyrcHZ0_JdMuRnRE4CZE';

// Check if credentials are properly configured
const isDemoMode = !supabaseUrl || !supabaseAnonKey || 
                   supabaseUrl === 'YOUR_SUPABASE_URL' || 
                   supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY';

// Get the correct redirect URL based on environment
const getRedirectUrl = () => {
  // Always use your production domain for OAuth redirects
  const productionUrl = 'https://review.evekung.com';
  
  // Check if we're in development (localhost)
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('localhost');
    
    if (isLocalhost) {
      // For local development, use localhost
      return window.location.origin;
    }
  }
  
  // For production, always use the production URL
  return productionUrl;
};

export const supabase = isDemoMode 
  ? null // We'll handle demo mode in the hooks
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
    });

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar_url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          website_url: string;
          x_position: number;
          y_position: number;
          text: string;
          author_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          website_url: string;
          x_position: number;
          y_position: number;
          text: string;
          author_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          website_url?: string;
          x_position?: number;
          y_position?: number;
          text?: string;
          author_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      comment_replies: {
        Row: {
          id: string;
          comment_id: string;
          text: string;
          author_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          comment_id: string;
          text: string;
          author_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          comment_id?: string;
          text?: string;
          author_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type CommentReply = Database['public']['Tables']['comment_replies']['Row'];

// Extended types for UI
export interface CommentWithAuthor extends Comment {
  author: Profile;
  replies: Array<CommentReply & { author: Profile }>;
}

// Demo mode flag
export { isDemoMode, getRedirectUrl };

// Mock data for demo mode
export const mockUser = {
  id: 'demo-user-1',
  email: 'demo@example.com',
  user_metadata: {
    full_name: 'Demo User',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  }
};

export const mockProfile: Profile = {
  id: 'demo-user-1',
  email: 'demo@example.com',
  name: 'Demo User',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockComments: CommentWithAuthor[] = [
  {
    id: '1',
    website_url: 'https://example.com',
    x_position: 200,
    y_position: 150,
    text: 'The navigation menu could be more prominent. Consider making it sticky or increasing the font size.',
    author_id: 'demo-user-2',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    author: {
      id: 'demo-user-2',
      email: 'sarah@example.com',
      name: 'Sarah Chen',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=32&h=32&fit=crop&crop=face',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    replies: [
      {
        id: '1-1',
        comment_id: '1',
        text: 'Agreed! The current navigation is hard to find. Maybe we should add a background color?',
        author_id: 'demo-user-3',
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        author: {
          id: 'demo-user-3',
          email: 'mike@example.com',
          name: 'Mike Johnson',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
    ]
  },
  {
    id: '2',
    website_url: 'https://example.com',
    x_position: 400,
    y_position: 300,
    text: 'This button needs better contrast for accessibility. The current color doesn\'t meet WCAG guidelines.',
    author_id: 'demo-user-1',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    author: mockProfile,
    replies: []
  }
];