"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { User, AuthError } from "@supabase/supabase-js";
import {
  supabase,
  Profile,
  isDemoMode,
  mockUser,
  mockProfile,
} from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInDemo: () => void;
  signOut: () => Promise<void>;
  error: string | null;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoModeActive, setDemoModeActive] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      console.log("🔐 Initializing auth...");
      setLoading(true);

      if (!isDemoMode && supabase) {
        try {
          // Handle the auth callback first
          const { data, error } =
            await supabase.auth.getSession();

          if (error) {
            console.error("❌ Session error:", error);
            if (
              error.message.includes("redirect") ||
              error.message.includes("localhost")
            ) {
              setError(
                `OAuth Configuration Error: ${error.message}. Please check your Supabase Site URL settings.`,
              );
            } else {
              setError(error.message);
            }
          } else if (data.session) {
            console.log(
              "✅ Found existing session:",
              data.session.user.email,
            );
            if (isMounted) {
              setUser(data.session.user);
              // Don't set loading false yet - wait for profile
              await handleUserSession(data.session.user);
            }
          } else {
            console.log("ℹ️ No existing session found");
          }
        } catch (err) {
          console.error("❌ Auth initialization error:", err);
          if (isMounted) {
            setError(
              err instanceof Error
                ? err.message
                : "Authentication failed",
            );
          }
        }
      }

      // Set loading to false after initial check
      if (isMounted) {
        console.log("✅ Initial auth check complete");
        setLoading(false);
      }
    };

    const handleUserSession = async (user: User) => {
      console.log("👤 Handling user session for:", user.email);
      setProfileLoading(true);

      try {
        // First ensure the profile exists
        await ensureProfile(user);
        // Then fetch the complete profile
        await fetchProfile(user.id);
        console.log("✅ User session handled successfully");
      } catch (error) {
        console.error("❌ Error handling user session:", error);
        // Don't block the UI for profile errors, but show a warning
        setError(
          "Profile setup incomplete. Some features may not work properly.",
        );
      } finally {
        setProfileLoading(false);
      }
    };

    // Initialize auth
    initializeAuth();

    // Set up auth state listener
    let authListener: any = null;
    if (!isDemoMode && supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log(
            "🔄 Auth state change:",
            event,
            session?.user?.email || "no user",
          );

          if (!isMounted) return;

          if (event === "SIGNED_IN" && session?.user) {
            console.log(
              "✅ User signed in:",
              session.user.email,
            );
            setUser(session.user);
            setError(null);

            // Handle user session (this will manage profile loading)
            await handleUserSession(session.user);

            // Clean up URL hash after successful sign in
            if (window.location.hash) {
              window.history.replaceState(
                null,
                "",
                window.location.pathname,
              );
            }
          } else if (event === "SIGNED_OUT") {
            console.log("👋 User signed out");
            setUser(null);
            setProfile(null);
            setError(null);
          } else if (
            event === "TOKEN_REFRESHED" &&
            session?.user
          ) {
            console.log(
              "🔄 Token refreshed for:",
              session.user.email,
            );
            setUser(session.user);
          }
        },
      );

      authListener = subscription;
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    if (!supabase) return;

    try {
      console.log("📝 Fetching profile for:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          console.log(
            "ℹ️ Profile not found, will be created on first upsert",
          );
        } else {
          throw error;
        }
      } else {
        console.log("✅ Profile fetched:", data.email);
        setProfile(data);
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      throw error;
    }
  };

  const ensureProfile = async (user: User) => {
    if (!supabase) return;

    try {
      console.log(
        "📝 Ensuring profile exists for:",
        user.email,
      );

      // First check if profile already exists
      const { data: existingProfile, error: fetchError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // Error other than "not found"
        throw fetchError;
      }

      if (existingProfile) {
        console.log("✅ Profile already exists");
        setProfile(existingProfile);
        return;
      }

      // Profile doesn't exist, create it
      console.log("📝 Creating new profile...");
      const profileData = {
        id: user.id,
        email: user.email || "",
        name:
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Anonymous",
        avatar_url:
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error("❌ Error creating profile:", error);
        throw error;
      }

      console.log("✅ Profile created successfully");
      setProfile(data);
    } catch (error) {
      console.error("❌ Error ensuring profile:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    if (isDemoMode) {
      setError(
        "Demo mode: Supabase credentials not configured. Please update lib/supabase.ts with your project credentials.",
      );
      return;
    }

    if (!supabase) {
      setError("Supabase client not configured");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const currentDomain = window.location.origin;
      console.log(
        "🔐 Starting Google sign-in, redirect URL:",
        currentDomain,
      );

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: currentDomain,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error("❌ OAuth initiation error:", error);
        setLoading(false);
        throw error;
      }
    } catch (error) {
      console.error("❌ Google sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during sign in",
      );
      setLoading(false);
    }
  };

  const signInDemo = () => {
    console.log("🎭 Signing in with demo mode");
    setUser(mockUser as any);
    setProfile(mockProfile);
    setDemoModeActive(true);
    setError(null);
    setLoading(false);
  };

  const signOut = async () => {
    if (isDemoMode || demoModeActive) {
      console.log("👋 Signing out of demo mode");
      window.location.reload();
      return;
    }

    if (!supabase) return;

    try {
      setError(null);
      console.log("👋 Signing out...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("✅ Signed out successfully");
    } catch (error) {
      console.error("❌ Sign out error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during sign out",
      );
    }
  };

  const isLoading = loading || profileLoading;

  console.log("🔍 AuthContext state:", {
    hasUser: !!user,
    userEmail: user?.email,
    hasProfile: !!profile,
    profileName: profile?.name,
    loading: isLoading,
    profileLoading,
    isDemoMode: isDemoMode || demoModeActive,
  });

  const value = {
    user,
    profile,
    loading: isLoading,
    signInWithGoogle,
    signInDemo,
    signOut,
    error,
    isDemoMode: isDemoMode || demoModeActive,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    );
  }
  return context;
}