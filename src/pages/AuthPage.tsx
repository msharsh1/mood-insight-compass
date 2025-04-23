
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const AuthPage = () => {
  const [variant, setVariant] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Admin credentials for quick check
  const isAdminCredentials = email === 'admin@mindtrack.com' && password === 'admin123';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email format",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      // Special handling for admin login
      if (isAdminCredentials) {
        const adminData = {
          id: 'admin-' + Date.now(),
          email: email,
          isAdmin: true
        };
        localStorage.setItem('currentUser', JSON.stringify(adminData));
        toast({ 
          title: "Admin login successful", 
          description: "Welcome to the admin dashboard" 
        });
        navigate("/admin");
        setSubmitting(false);
        return;
      }

      if (variant === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });

        if (error) {
          toast({ 
            title: "Login failed", 
            description: error.message, 
            variant: "destructive" 
          });
        } else {
          // Regular user login
          const userData = {
            id: data.user?.id || 'user-' + Date.now(),
            email: data.user?.email || email,
            isAdmin: false
          };
          localStorage.setItem('currentUser', JSON.stringify(userData));
          
          // Save user data in localStorage for admin to view
          const userId = `user_${userData.id}`;
          if (!localStorage.getItem(userId)) {
            localStorage.setItem(userId, JSON.stringify(userData));
          }
          
          toast({ 
            title: "Login successful", 
            description: "Welcome back!" 
          });
          navigate("/");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password 
        });

        if (error) {
          toast({ 
            title: "Sign up failed", 
            description: error.message, 
            variant: "destructive" 
          });
        } else {
          // Store new user in localStorage
          if (data.user) {
            const userData = {
              id: data.user?.id || 'user-' + Date.now(),
              email: data.user?.email || email,
              isAdmin: false
            };
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            // Save user data in localStorage for admin to view
            const userId = `user_${userData.id}`;
            localStorage.setItem(userId, JSON.stringify(userData));
          }
          
          toast({ 
            title: "Sign up successful", 
            description: "Welcome to MindTrack!" 
          });
          navigate("/");
        }
      }
    } catch (error: any) {
      toast({ 
        title: "Authentication error", 
        description: error.message || "An unexpected error occurred", 
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-sm w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">
            {variant === "login" ? "Login" : "Sign Up"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              disabled={submitting}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              disabled={submitting}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" disabled={submitting} className="w-full">
              {variant === "login" ? "Log In" : "Sign Up"}
            </Button>
            
            <div className="text-xs text-muted-foreground mt-2 text-center">
              <p>Admin access: admin@mindtrack.com / admin123</p>
            </div>
          </form>
          <div className="text-center text-sm mt-4">
            {variant === "login"
              ? (
                <>
                  Don't have an account?{" "}
                  <button
                    className="text-mental-purple underline"
                    onClick={() => setVariant("signup")}
                    disabled={submitting}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    className="text-mental-purple underline"
                    onClick={() => setVariant("login")}
                    disabled={submitting}
                  >
                    Log In
                  </button>
                </>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
