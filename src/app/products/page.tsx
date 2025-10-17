"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAppSelector } from "@/store/hooks";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useSearchProductsQuery,
} from "@/store/api/productsApi";
import { useGetCategoriesQuery } from "@/store/api/categoriesApi";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Modal from "@/components/ui/Modal";
import type { Product } from "@/types";

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null,
  });

  const itemsPerPage = 20;
  const offset = (currentPage - 1) * itemsPerPage;
  const totalPages = 10; // Approximate, can be adjusted based on API response

  // Get category and search from URL parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const searchFromUrl = searchParams.get("search");

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory("");
    }

    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      setDebouncedSearch(searchFromUrl);
    } else {
      setSearchQuery("");
      setDebouncedSearch("");
    }
  }, [searchParams]);

  // Debounce search with 400ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Fetch data
  const { data: categories } = useGetCategoriesQuery({ offset: 0, limit: 100 });
  const { data: searchResults, isLoading: isSearching } =
    useSearchProductsQuery(debouncedSearch, {
      skip: !debouncedSearch,
    });
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery(
    {
      offset,
      limit: itemsPerPage,
      categoryId: selectedCategory,
    },
    { skip: !!debouncedSearch }
  );
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Filter products based on search and category
  const displayProducts = useMemo(() => {
    if (debouncedSearch && searchResults) {
      // If searching, filter by category if selected
      if (selectedCategory) {
        return searchResults.filter(
          (product) => product.category.id === selectedCategory
        );
      }
      return searchResults;
    }
    return products;
  }, [debouncedSearch, searchResults, products, selectedCategory]);

  const handleDelete = async () => {
    if (!deleteModal.product) return;

    try {
      await deleteProduct(deleteModal.product.id).unwrap();
      toast.success(`${deleteModal.product.name} deleted successfully!`);
      setDeleteModal({ isOpen: false, product: null });
      refetch();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    // Update URL preserving search parameter
    const search = searchParams.get("search");
    const params = new URLSearchParams();
    if (categoryId) {
      params.set("category", categoryId);
    }
    if (search) {
      params.set("search", search);
    }
    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : "/products");
  };

  const selectedCategoryData = categories?.find(
    (cat) => cat.id === selectedCategory
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800 text-white hover:bg-celtic-blue hover:border-celtic-blue transition-all"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots1" className="px-2 text-neutral-500">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg border transition-all ${
            currentPage === i
              ? "bg-celtic-blue border-celtic-blue text-white font-bold shadow-lg shadow-celtic-blue/30"
              : "border-neutral-700 bg-neutral-800 text-white hover:bg-celtic-blue hover:border-celtic-blue"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots2" className="px-2 text-neutral-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800 text-white hover:bg-celtic-blue hover:border-celtic-blue transition-all"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    );

    return pages;
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rich-black to-neutral-900">
        <Loading size="lg" text="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rich-black to-neutral-900">
        <ErrorMessage
          message="Failed to load products. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rich-black to-neutral-900">
      <div className="flex">
        {/* Left Sidebar - Filters */}
        <aside className="hidden lg:block w-64 xl:w-72 border-r border-neutral-800 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Filter Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-lg font-bold text-white">FILTERS</h2>
              {selectedCategory && (
                <button
                  onClick={() => handleCategoryChange("")}
                  className="text-imperial-red text-sm font-semibold hover:text-imperial-red/80 transition-colors"
                >
                  CLEAR ALL
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">
                CATEGORIES
              </h3>
              <div className="space-y-1">
                <label className="flex items-center space-x-3 cursor-pointer group p-3 rounded-lg hover:bg-neutral-800/50 transition-all">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={!selectedCategory}
                      onChange={() => handleCategoryChange("")}
                      className="appearance-none w-5 h-5 border-2 border-neutral-600 rounded checked:bg-celtic-blue checked:border-celtic-blue focus:outline-none focus:ring-2 focus:ring-celtic-blue focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all cursor-pointer"
                    />
                    {!selectedCategory && (
                      <svg
                        className="absolute top-0 left-0 w-5 h-5 text-white pointer-events-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-neutral-300 group-hover:text-white transition-colors font-medium">
                    All Categories
                  </span>
                </label>
                {categories?.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-3 cursor-pointer group p-3 rounded-lg hover:bg-neutral-800/50 transition-all"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedCategory === category.id}
                        onChange={() => handleCategoryChange(category.id)}
                        className="appearance-none w-5 h-5 border-2 border-neutral-600 rounded checked:bg-celtic-blue checked:border-celtic-blue focus:outline-none focus:ring-2 focus:ring-celtic-blue focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all cursor-pointer"
                      />
                      {selectedCategory === category.id && (
                        <svg
                          className="absolute top-0 left-0 w-5 h-5 text-white pointer-events-none"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-neutral-300 group-hover:text-white transition-colors font-medium">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header with Create Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {selectedCategoryData
                    ? selectedCategoryData.name
                    : "All Products"}
                </h1>
                <p className="text-neutral-400">
                  {products?.length || 0} products available
                </p>
              </div>
              <Link href="/products/create">
                <Button variant="primary" size="lg">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New Product
                </Button>
              </Link>
            </div>

            {/* Mobile Category Filter */}
            <div className="lg:hidden mb-6">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-celtic-blue"
              >
                <option value="">All Categories</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Results Info */}
            {debouncedSearch && (
              <div className="mb-4 px-4 py-3 bg-celtic-blue/10 border border-celtic-blue/30 rounded-lg">
                <p className="text-celtic-blue text-sm">
                  {isSearching ? (
                    "Searching..."
                  ) : (
                    <>
                      Found{" "}
                      <span className="font-bold">
                        {displayProducts?.length || 0}
                      </span>{" "}
                      result{displayProducts?.length !== 1 ? "s" : ""} for
                      &ldquo;{debouncedSearch}&rdquo;
                      {selectedCategory && selectedCategoryData && (
                        <>
                          {" "}
                          in{" "}
                          <span className="font-bold">
                            {selectedCategoryData.name}
                          </span>
                        </>
                      )}
                    </>
                  )}
                </p>
              </div>
            )}

            {/* Products Grid */}
            {isLoading || isSearching ? (
              <div className="flex items-center justify-center py-16">
                <Loading
                  size="lg"
                  text={
                    isSearching
                      ? "Searching products..."
                      : "Loading products..."
                  }
                />
              </div>
            ) : !displayProducts || displayProducts.length === 0 ? (
              <div className="bg-neutral-900 rounded-lg shadow-md border border-neutral-800 p-16 text-center">
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
                  No products found
                </h3>
                <p className="text-neutral-400 mb-6">
                  {debouncedSearch
                    ? `No products match "${debouncedSearch}"${
                        selectedCategory ? " in this category" : ""
                      }.`
                    : selectedCategory
                    ? "No products in this category yet."
                    : "Start adding products to your inventory."}
                </p>
                {!selectedCategory && !debouncedSearch && (
                  <Link href="/products/create">
                    <Button variant="primary" size="lg">
                      Create Your First Product
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayProducts.map((product) => {
                  // Get first valid image
                  const getProductImage = () => {
                    if (
                      product.images &&
                      Array.isArray(product.images) &&
                      product.images.length > 0
                    ) {
                      const validImage = product.images.find((img) => {
                        if (!img) return false;
                        try {
                          new URL(img);
                          return true;
                        } catch {
                          return false;
                        }
                      });
                      if (validImage) return validImage;
                    }

                    if (product.image) {
                      try {
                        new URL(product.image);
                        return product.image;
                      } catch {
                        return "https://via.placeholder.com/400x400/0D1821/276FBF?text=No+Image";
                      }
                    }

                    return "https://via.placeholder.com/400x400/0D1821/276FBF?text=No+Image";
                  };

                  const imageUrl = getProductImage();

                  return (
                    <div
                      key={product.id}
                      className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:shadow-2xl hover:border-celtic-blue transition-all duration-300 group"
                    >
                      {/* Product Image */}
                      <Link href={`/products/${product.slug}`}>
                        <div className="relative h-80 bg-gradient-to-br from-neutral-800 to-neutral-900 overflow-hidden cursor-pointer">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                            unoptimized
                          />
                          {/* NEW Badge */}
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 bg-imperial-red text-white text-xs font-bold rounded shadow-lg">
                              NEW
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="p-4 space-y-2">
                        {/* Brand/Category */}
                        <p className="text-xs text-neutral-500 uppercase tracking-wide font-semibold">
                          {product.category.name}
                        </p>

                        {/* Product Name */}
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="text-sm font-semibold text-white hover:text-celtic-blue transition-colors line-clamp-1 cursor-pointer">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Description */}
                        <p className="text-xs text-neutral-400 line-clamp-1">
                          {product.description}
                        </p>

                        {/* Price */}
                        <div className="flex items-center gap-2 pt-2">
                          <span className="text-lg font-bold text-white">
                            ৳{product.price.toLocaleString()}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-3">
                          <Link
                            href={`/products/edit/${product.id}`}
                            className="w-full"
                          >
                            <button className="w-full px-3 py-2 text-xs font-semibold text-celtic-blue border border-celtic-blue rounded hover:bg-celtic-blue hover:text-white transition-colors">
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() =>
                              setDeleteModal({ isOpen: true, product })
                            }
                            className="w-full px-3 py-2 text-xs font-semibold text-imperial-red border border-imperial-red rounded hover:bg-imperial-red hover:text-white transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {products && products.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  {renderPagination()}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, product: null })}
        title="Delete Product"
        size="sm"
      >
        <div className="space-y-6">
          <div className="bg-imperial-red/10 border-l-4 border-imperial-red rounded-lg p-4">
            <p className="text-white font-semibold mb-2">
              ⚠️ Warning: This action cannot be undone!
            </p>
            <p className="text-neutral-400 text-sm">
              Are you sure you want to delete{" "}
              <span className="font-bold text-white">
                {deleteModal.product?.name}
              </span>
              ?
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, product: null })}
              disabled={isDeleting}
              size="lg"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              size="lg"
              className="font-bold"
            >
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rich-black to-neutral-900">
          <Loading size="lg" text="Loading products..." />
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
