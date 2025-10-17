import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Product, CreateProductDto, UpdateProductDto } from "@/types";

const BASE_URL = "https://api.bitechx.com";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth?: { token?: string } };
      const token = state.auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<
      Product[],
      { offset?: number; limit?: number; categoryId?: string }
    >({
      query: ({ offset = 0, limit = 10, categoryId }) => {
        const params = new URLSearchParams({
          offset: offset.toString(),
          limit: limit.toString(),
        });
        if (categoryId) {
          params.append("categoryId", categoryId);
        }
        return `/products?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `/products/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Product", id: slug }],
    }),
    searchProducts: builder.query<Product[], string>({
      query: (searchedText) =>
        `/products/search?searchedText=${encodeURIComponent(searchedText)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "SEARCH" },
            ]
          : [{ type: "Product", id: "SEARCH" }],
    }),
    createProduct: builder.mutation<Product, CreateProductDto>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation<
      Product,
      { id: string; data: UpdateProductDto }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
    deleteProduct: builder.mutation<Product, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useSearchProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
