"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAppSelector } from "@/store/hooks";
import {
  useGetProductBySlugQuery,
  useDeleteProductMutation,
} from "@/store/api/productsApi";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Modal from "@/components/ui/Modal";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductBySlugQuery(resolvedParams.slug);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleDelete = async () => {
    if (!product) return;

    try {
      await deleteProduct(product.id).unwrap();
      toast.success("Product deleted successfully!");
      setDeleteModal(false);
      router.push("/products");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <Loading size="lg" text="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <ErrorMessage
        message="Failed to load product details. Please try again."
        onRetry={refetch}
      />
    );
  }

  // Get all valid images
  const getValidImages = () => {
    const images: string[] = [];

    // Add images from images array
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img) {
          try {
            new URL(img);
            images.push(img);
          } catch {
            // Skip invalid URLs
          }
        }
      });
    }

    // Add image property if not already in array
    if (product.image) {
      try {
        new URL(product.image);
        if (!images.includes(product.image)) {
          images.push(product.image);
        }
      } catch {
        // Skip invalid URL
      }
    }

    // Fallback if no valid images
    if (images.length === 0) {
      images.push("/images/nope-not-here.avif");
    }

    return images;
  };

  const validImages = getValidImages();
  const selectedImage = validImages[selectedImageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rich-black to-neutral-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 sm:mb-6">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm">
            <li>
              <Link
                href="/products"
                className="text-neutral-400 hover:text-celtic-blue transition-colors cursor-pointer"
              >
                Products
              </Link>
            </li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-400 font-semibold truncate max-w-[150px] sm:max-w-xs">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {/* Image Gallery Section */}
          <div className="lg:col-span-3">
            <div className="bg-neutral-900 rounded-xl sm:rounded-2xl border-2 border-neutral-800 overflow-hidden shadow-xl">
              {/* Main Image */}
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gradient-to-br from-neutral-800 to-neutral-900 p-4 sm:p-8">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  unoptimized
                  priority
                />
              </div>

              {/* Thumbnail Images */}
              {validImages.length > 1 && (
                <div className="p-3 sm:p-4 bg-neutral-900 border-t-2 border-neutral-800">
                  <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                    {validImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-3 transition-all duration-300 cursor-pointer ${
                          selectedImageIndex === index
                            ? "border-celtic-blue ring-4 ring-celtic-blue/30 scale-105"
                            : "border-neutral-700 hover:border-celtic-blue/50"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} - Image ${index + 1}`}
                          fill
                          className="object-contain p-2 bg-neutral-800"
                          sizes="80px"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Product Title & Category */}
            <div className="bg-neutral-900 rounded-xl sm:rounded-2xl border-2 border-neutral-800 p-4 sm:p-6 shadow-xl">
              <div className="inline-block mb-3">
                <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-celtic-blue to-pomp-and-power text-white text-xs sm:text-sm font-bold rounded-full shadow-lg">
                  {product.category.name}
                </span>
              </div>

              <h1 className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-black text-white mb-4 leading-tight break-words">
                {product.name}
              </h1>

              {/* Price */}
              <div className="bg-gradient-to-r from-imperial-red/20 via-imperial-red/10 to-transparent rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border-l-4 border-imperial-red">
                <p className="text-xs sm:text-sm text-neutral-400 mb-1 font-semibold">
                  Price
                </p>
                <p className="text-lg sm:text-xl md:text-2xl 2xl:text-3xl font-black text-imperial-red">
                  ৳ {product.price.toLocaleString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Link href={`/products/edit/${product.id}`} className="w-full">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span className="hidden sm:inline">Edit Product</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => setDeleteModal(true)}
                  className="w-full cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </Button>
              </div>
            </div>

            {/* Product Description */}
            <div className="bg-neutral-900 rounded-xl sm:rounded-2xl border-2 border-neutral-800 p-4 sm:p-6 shadow-xl">
              <h2 className="test-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-celtic-blue"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Description
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed whitespace-pre-line break-words">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            <div className="bg-neutral-900 rounded-xl sm:rounded-2xl border-2 border-neutral-800 p-4 sm:p-6 shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-celtic-blue"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Details
              </h2>
              <dl className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 sm:py-3 border-b border-neutral-800 gap-1">
                  <dt className="text-xs sm:text-sm font-semibold text-neutral-400">
                    Category Name
                  </dt>
                  <dd className="text-xs sm:text-sm font-mono text-white break-words">
                    {product?.category?.name}
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 sm:py-3 border-b border-neutral-800 gap-1">
                  <dt className="text-xs sm:text-sm font-semibold text-neutral-400">
                    Created At
                  </dt>
                  <dd className="text-xs sm:text-sm text-white">
                    {new Date(product.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 sm:py-3 gap-1">
                  <dt className="text-xs sm:text-sm font-semibold text-neutral-400">
                    Last Updated
                  </dt>
                  <dd className="text-xs sm:text-sm text-white">
                    {new Date(product.updatedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Product"
        size="sm"
      >
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-imperial-red/10 border-l-4 border-imperial-red rounded-lg p-3 sm:p-4">
            <p className="text-sm sm:text-base text-white font-semibold mb-2">
              ⚠️ Warning: This action cannot be restored!
            </p>
            <p className="text-xs sm:text-sm text-neutral-400">
              Are you sure you want to delete{" "}
              <span className="font-bold text-white">{product.name}</span>?
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteModal(false)}
              disabled={isDeleting}
              size="md"
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              size="md"
              className="font-bold cursor-pointer"
            >
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
