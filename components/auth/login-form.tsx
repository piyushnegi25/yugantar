"use client";

import type React from "react";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, Chrome, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { sanitizeCallbackUrl } from "@/lib/security/validation";

interface LoginFormProps {
  onToggleForm: () => void;
}

function LoginFormContent({ onToggleForm }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Determine callbackUrl: use ?callbackUrl=... if present, else current path
  const callbackUrl = sanitizeCallbackUrl(
    searchParams.get("callbackUrl") || pathname
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store user data in localStorage for client-side access
      localStorage.setItem("user", JSON.stringify(data.user));

      try {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "user",
            newValue: JSON.stringify(data.user),
          })
        );
      } catch {
        // Ignore cross-browser StorageEvent constructor issues.
      }

      // Redirect based on role or callbackUrl
      if (data.user.role === "admin") {
        router.push("/admin");
      } else if (callbackUrl && callbackUrl !== "/auth") {
        router.push(callbackUrl);
      } else {
        router.push("/");
      }

      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch(
        `/api/auth/google/url?callbackUrl=${encodeURIComponent(callbackUrl)}`
      );
      const data = await response.json();

      if (!response.ok || !data?.success || !data?.url) {
        throw new Error(data?.error || "Google OAuth is not configured");
      }

      window.location.href = data.url;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to initialize Google OAuth");
    }
  };

  return (
    <Card className="surface-card mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-extrabold lowercase text-foreground">
          Welcome Back
        </CardTitle>
        <p className="text-muted-foreground">
          Sign in to your Yugantar account
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="pl-10 pr-10"
                required
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground disabled:opacity-50"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" className="rounded" disabled={isLoading} />
              <span className="text-muted-foreground">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:text-primary/80"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full bg-transparent"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <Chrome className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>

        <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <button
              onClick={onToggleForm}
              className="font-medium text-primary hover:text-primary/80"
              disabled={isLoading}
            >
            Sign up
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export function LoginForm({ onToggleForm }: LoginFormProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent onToggleForm={onToggleForm} />
    </Suspense>
  );
}
