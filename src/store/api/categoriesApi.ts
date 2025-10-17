import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Category } from "@/types";

const BASE_URL = "https://api.bitechx.com";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
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
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query<
      Category[],
      { offset?: number; limit?: number }
    >({
      query: ({ offset = 0, limit = 100 }) =>
        `/categories?offset=${offset}&limit=${limit}`,
      providesTags: [{ type: "Category", id: "LIST" }],
    }),
    searchCategories: builder.query<Category[], string>({
      query: (searchedText) =>
        `/categories/search?searchedText=${encodeURIComponent(searchedText)}`,
      providesTags: [{ type: "Category", id: "SEARCH" }],
    }),
  }),
});

export const { useGetCategoriesQuery, useSearchCategoriesQuery } =
  categoriesApi;
