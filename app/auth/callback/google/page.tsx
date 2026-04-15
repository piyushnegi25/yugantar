"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { sanitizeCallbackUrl } from "@/lib/security/validation";

function GoogleCallbackContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processing authentication...");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const error = searchParams.get("error");
        const authSuccess = searchParams.get("auth");
        const errorMessage = searchParams.get("message");

        if (error) {
          setStatus("error");
          setMessage(errorMessage || `Authentication failed: ${error}`);
          return;
        }

        if (authSuccess === "success") {
          setStatus("success");
          setMessage("Authentication successful! Loading your profile...");

              // Get the intended callback URL
              const intendedCallbackUrl = sanitizeCallbackUrl(
                searchParams.get("callbackUrl") || "/"
              );

          // Fetch user data and populate localStorage
          try {
            const userResponse = await fetch("/api/auth/me");
            if (userResponse.ok) {
              const userData = await userResponse.json();
              localStorage.setItem("user", JSON.stringify(userData.user));
              setMessage("Welcome back! Redirecting...");

              // Redirect to the intended destination or based on user role
              setTimeout(() => {
                let finalRedirect = intendedCallbackUrl;

                // Override with role-based redirect if going to default pages
                if (
                  userData.user.role === "admin" &&
                  (finalRedirect === "/" || finalRedirect === "/auth")
                ) {
                  finalRedirect = "/admin";
                }

                router.push(finalRedirect);
              }, 1500);
            } else {
              throw new Error("Failed to fetch user data");
            }
          } catch (error) {
            console.error("Failed to fetch user data:", error);
            setStatus("error");
            setMessage(
              "Authentication successful but failed to load profile. Please try refreshing."
            );
          }
          return;
        }

        // If we get here with error
        if (error) {
          setStatus("error");
          setMessage(errorMessage || `Authentication failed: ${error}`);
          return;
        }

        // If we have neither auth=success nor error, something is wrong
        setStatus("error");
        setMessage("Invalid authentication state. Please try again.");
      } catch (error) {
        console.error("Authentication error:", error);
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Authentication failed"
        );
      }
    };

    handleCallback();
  }, [searchParams, router]);

  const getIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "error":
        return <XCircle className="h-8 w-8 text-red-500" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case "loading":
        return "Authenticating...";
      case "success":
        return "Welcome!";
      case "error":
        return "Authentication Failed";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            {getIcon()}
            <h2 className="text-xl font-semibold text-center">{getTitle()}</h2>
            <p className="text-sm text-gray-600 text-center">{message}</p>

            {status === "error" && (
              <div className="w-full space-y-2">
                <Button asChild className="w-full">
                  <Link href="/auth">Try Again</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">Go Home</Link>
                </Button>
              </div>
            )}

            {status === "success" && (
              <p className="text-xs text-gray-500 text-center">
                You will be redirected automatically...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
