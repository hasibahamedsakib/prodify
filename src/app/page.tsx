"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { useGetCategoriesQuery } from "@/store/api/categoriesApi";
import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useGetCategoriesQuery({ offset: 0, limit: 100 });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rich-black to-neutral-900">
        <Loading size="lg" text="Loading categories..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rich-black to-neutral-900">
        <ErrorMessage
          message="Failed to load categories. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rich-black to-neutral-900 pb-8 sm:pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-10 sm:mb-16">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4"
            style={{
              background: "linear-gradient(to right, #276FBF, #785589)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            SHOP BY CATEGORY
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg md:text-xl px-4">
            Browse our collection and find exactly what you need
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group cursor-pointer"
            >
              <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden border-2 border-neutral-700 hover:border-celtic-blue transition-all duration-300 hover:shadow-2xl hover:shadow-celtic-blue/20 hover:scale-105">
                {/* Category Image */}
                <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 bg-gradient-to-br from-neutral-700 to-neutral-800 overflow-hidden">
                  <Image
                    src={category.image || "/images/nope-not-here.avif"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                </div>

                {/* Category Name */}
                <div className="p-3 sm:p-4 text-center">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white group-hover:text-celtic-blue transition-colors line-clamp-1">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs sm:text-sm text-neutral-400 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-2 sm:mt-3 text-accent font-semibold text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop Now →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Categories */}
        {(!categories || categories.length === 0) && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-neutral-800 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-neutral-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              No categories available
            </h3>
            <p className="text-neutral-400">
              Categories will appear here once they are added.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
