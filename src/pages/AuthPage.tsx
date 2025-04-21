
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
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener BEFORE checking for session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (variant === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Login successful" });
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Sign up successful", description: "Please check your email for a confirmation link." });
        setVariant("login");
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-sm w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">{variant === "login" ? "Login" : "Sign Up"}</CardTitle>
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
            />
            <Button type="submit" disabled={submitting} className="w-full">
              {variant === "login" ? "Log In" : "Sign Up"}
            </Button>
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
