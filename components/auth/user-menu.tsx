"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Settings,
  ShoppingBag,
  Heart,
  LogOut,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";

interface UserData {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: "user" | "admin";
}

function getInitials(name: string): string {
  const safe = name.trim();
  if (!safe) {
    return "U";
  }

  const parts = safe.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function UserMenu() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Always check server for valid JWT first
        try {
          const response = await fetch("/api/auth/me", {
            method: "GET",
            credentials: "include", // Important: include cookies
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
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

            setIsLoading(false);
            return;
          } else {
            // Server says no valid auth, clear everything
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("auth_token");

            try {
              window.dispatchEvent(
                new StorageEvent("storage", {
                  key: "user",
                  newValue: null,
                })
              );
            } catch {
              // Ignore cross-browser StorageEvent constructor issues.
            }
          }
        } catch (error) {
          console.error("Failed to fetch user from server:", error);
        }

        // Fallback: check localStorage only if server check failed
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
          } catch (e) {
            console.error("Failed to parse user data from localStorage:", e);
            localStorage.removeItem("user");
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Listen for storage changes (for multiple tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error(
              "Failed to parse user data from storage event:",
              error
            );
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    // Listen for focus events to re-check auth when user returns to tab
    const handleFocus = () => {
      loadUser();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear both localStorage and state
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
      setUser(null);

      try {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "user",
            newValue: null,
          })
        );
      } catch {
        // Ignore cross-browser StorageEvent constructor issues.
      }

      // Force reload to clear any cached data
      window.location.href = "/";
    }
  };

  if (isLoading) {
    return (
      <div className="w-8 h-8 bg-gray-200  rounded-full animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link href="/auth">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
        >
          Sign In
        </Button>
      </Link>
    );
  }

  const initials = getInitials(user.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.picture || "/placeholder.svg"}
              alt={user.name}
            />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {user.role === "admin" && (
              <span className="text-xs bg-red-100 text-red-800   px-2 py-1 rounded-full w-fit">
                Admin
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders" className="cursor-pointer">
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span>My Orders</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/wishlist" className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            <span>Wishlist</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        {user.role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
