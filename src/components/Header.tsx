"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import Button from "./ui/Button";

const HeaderContent: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { email, isAuthenticated } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync search query with URL parameter
  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    } else {
      setSearchQuery("");
    }
  }, [searchParams]);

  // Debounced realtime search with 400ms delay
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      const category = searchParams.get("category");
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }
      if (category) {
        params.set("category", category);
      }

      const queryString = params.toString();
      const newUrl = queryString ? `/products?${queryString}` : "/products";

      // Only navigate if we're on products page and URL would change
      if (pathname === "/products" || pathname?.startsWith("/products")) {
        router.push(newUrl);
      }
    }, 400);

    // Cleanup timer on unmount or when dependencies change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, searchParams, pathname, router]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    toast.success("Logged out successfully!");
    window.location.href = "/login";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission now just triggers immediate search by clearing debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const category = searchParams.get("category");
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (category) {
      params.set("category", category);
    }

    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : "/products");
  };

  if (!isAuthenticated) return null;

  const showSearch =
    pathname === "/products" || pathname?.startsWith("/products");

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-900/95 backdrop-blur-lg border-b border-neutral-800 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-celtic-blue to-pomp-and-power rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <span
                className="text-xl font-bold"
                style={{
                  background: "linear-gradient(to right, #276FBF, #785589)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Prodify
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-neutral-300 hover:text-accent transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-neutral-300 hover:text-accent transition-colors font-medium"
              >
                Products
              </Link>
              <Link
                href="/products/create"
                className="text-neutral-300 hover:text-accent transition-colors font-medium"
              >
                Create Product
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3 flex-1 max-w-2xl mx-4">
            {/* Search Bar */}
            {showSearch && (
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="search"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-celtic-blue focus:border-transparent transition-all"
                  />
                </div>
              </form>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-neutral-800 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-celtic-blue to-pomp-and-power rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {email?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-neutral-300">
                {email}
              </span>
            </div>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

const Header: React.FC = () => {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-40 w-full bg-neutral-900/95 backdrop-blur-lg border-b border-neutral-800 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="w-32 h-8 bg-neutral-800 animate-pulse rounded" />
            <div className="w-64 h-8 bg-neutral-800 animate-pulse rounded" />
            <div className="w-32 h-8 bg-neutral-800 animate-pulse rounded" />
          </div>
        </div>
      </header>
    }>
      <HeaderContent />
    </Suspense>
  );
};

export default Header;
