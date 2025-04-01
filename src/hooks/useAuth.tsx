
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<{
    success: boolean;
    error: string | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    error: string | null;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for auth parameters in URL
    const handleAuthRedirect = async () => {
      // Handle hash params (from email auth, OAuth, etc.)
      if (window.location.hash.includes("access_token")) {
        try {
          // Get the session using the access token
          const { data, error } = await supabase.auth.getSession();
          
          if (error) throw error;
          if (data && data.session) {
            setSession(data.session);
            setUser(data.session.user);
            
            // Clear the hash fragment without redirecting
            window.history.replaceState(null, "", window.location.pathname);
            
            // Show success message and redirect to dashboard
            toast({
              title: "Login successful!",
              description: "You have been successfully authenticated.",
            });
            
            // Wait a moment to allow the auth state to update
            setTimeout(() => {
              navigate("/dashboard");
            }, 500);
          }
        } catch (error) {
          console.error("Authentication error:", error);
          toast({
            title: "Authentication failed",
            description: "There was a problem with the authentication process.",
            variant: "destructive",
          });
        }
      }
    };
    
    handleAuthRedirect();
  }, [navigate, location]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { 
        success: false, 
        error: "An unexpected error occurred during sign up." 
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { 
        success: false, 
        error: "An unexpected error occurred during sign in." 
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Use window.location for a full page reload to clear any stale state
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signUp,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
