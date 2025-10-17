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
  const { data: categories, isLoading, error, refetch } = useGetCategoriesQuery({ offset: 0, limit: 100 });

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
    <div className="min-h-screen bg-gradient-to-br from-rich-black to-neutral-900 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 
            className="text-5xl md:text-6xl font-black mb-4"
            style={{
              background: "linear-gradient(to right, #276FBF, #785589)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            SHOP BY CATEGORY
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl">
            Browse our collection and find exactly what you need
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group"
            >
              <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl overflow-hidden border-2 border-neutral-700 hover:border-celtic-blue transition-all duration-300 hover:shadow-2xl hover:shadow-celtic-blue/20 hover:scale-105">
                {/* Category Image */}
                <div className="relative h-48 md:h-56 bg-gradient-to-br from-neutral-700 to-neutral-800 overflow-hidden">
                  <Image
                    src={category.image || "https://via.placeholder.com/400x400/0D1821/276FBF?text=No+Image"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                </div>

                {/* Category Name */}
                <div className="p-4 text-center">
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-celtic-blue transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-neutral-400 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-3 text-accent font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
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
