"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAppSelector } from "@/store/hooks";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductsQuery,
} from "@/store/api/productsApi";
import { useGetCategoriesQuery } from "@/store/api/categoriesApi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import type { CreateProductDto } from "@/types";

interface ProductFormProps {
  productId?: string;
  isEdit?: boolean;
}

export default function ProductForm({
  productId,
  isEdit = false,
}: ProductFormProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<CreateProductDto>({
    name: "",
    description: "",
    price: 0,
    images: [""],
    categoryId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageInput, setImageInput] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery({ offset: 0, limit: 100 });
  const { data: products } = useGetProductsQuery(
    { offset: 0, limit: 1000 },
    { skip: !isEdit || !productId }
  );
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isSaving = isCreating || isUpdating;

  // Load existing product data for editing
  useEffect(() => {
    if (isEdit && productId && products && !isDataLoaded) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          images:
            product.images && product.images.length > 0
              ? product.images
              : [product.image],
          categoryId: product.category.id,
        });
        setIsDataLoaded(true);
      }
    }
  }, [isEdit, productId, products, isDataLoaded]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Product name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
    }

    if (formData.images.length === 0 || !formData.images[0]) {
      newErrors.images = "At least one image URL is required";
    } else {
      formData.images.forEach((img, index) => {
        if (img && !isValidUrl(img)) {
          newErrors[`image_${index}`] = "Please enter a valid URL";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (
    field: keyof CreateProductDto,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddImage = () => {
    if (imageInput && isValidUrl(imageInput)) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images.filter((img) => img), imageInput],
      }));
      setImageInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        images: formData.images.filter((img) => img),
      };

      if (isEdit && productId) {
        await updateProduct({ id: productId, data: dataToSubmit }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await createProduct(dataToSubmit).unwrap();
        toast.success("Product created successfully!");
      }
      router.push("/products");
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error(
        isEdit
          ? "Failed to update product. Please try again."
          : "Failed to create product. Please try again."
      );
      setErrors({ submit: "Failed to save product. Please try again." });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rich-black via-neutral-900 to-neutral-800 py-3 sm:py-6 lg:py-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 max-w-3xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-neutral-400 hover:text-celtic-blue hover:text-accent mb-2 sm:mb-3 lg:mb-4 transition-colors cursor-pointer text-sm sm:text-base"
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2"
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
            Back
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
            {isEdit ? "Edit Product" : "Create New Product"}
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-neutral-400">
            {isEdit
              ? "Update your product information"
              : "Add a new product to your catalog"}
          </p>
        </div>

        {/* Form */}
        <Card className="p-3 sm:p-4 md:p-6 lg:p-8 bg-neutral-900 border border-neutral-800 shadow-xl">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-5 lg:space-y-6"
          >
            {/* Product Name */}
            <Input
              label="Product Name"
              type="text"
              placeholder="Enter product name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
            />

            {/* Description */}
            <TextArea
              label="Description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              error={errors.description}
              rows={4}
              required
            />

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Price"
                type="number"
                placeholder="0.00"
                value={formData.price || ""}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value) || 0)
                }
                error={errors.price}
                min="0"
                step="0.01"
                required
              />

              <Select
                label="Category"
                value={formData.categoryId}
                onChange={(e) =>
                  handleInputChange("categoryId", e.target.value)
                }
                error={errors.categoryId}
                options={[
                  { value: "", label: "Select a category" },
                  ...(categories?.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  })) || []),
                ]}
                disabled={isCategoriesLoading}
                required
              />
            </div>

            {/* Images Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-neutral-300">
                Product Images <span className="text-imperial-red">*</span>
              </label>

              {/* Existing Images */}
              {formData.images.filter((img) => img).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {formData.images
                    .filter((img) => img)
                    .map((image, index) => (
                      <div key={index} className="relative group h-28 sm:h-32">
                        <Image
                          src={image}
                          alt={`Product ${index + 1}`}
                          fill
                          className="object-cover rounded-lg border-2 border-neutral-700"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 sm:top-2 right-1 sm:right-2 p-1 bg-imperial-red text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                </div>
              )}

              {/* Add Image URL */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="url"
                  placeholder="Enter image URL"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddImage}
                  className="sm:w-[150px] cursor-pointer"
                >
                  Add Image
                </Button>
              </div>

              {errors.images && (
                <p className="text-sm text-imperial-red">
                  {errors.images}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-imperial-red/10 border border-imperial-red/30 rounded-lg">
                <p className="text-sm text-imperial-red">
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1 cursor-pointer"
                isLoading={isSaving}
              >
                {isEdit ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
