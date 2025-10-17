"use client";

import { use } from "react";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  return <ProductForm isEdit productId={resolvedParams.id} />;
}
