export interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  image: string;
  price: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

export interface CreateProductDto {
  name: string;
  description: string;
  images: string[];
  price: number;
  categoryId: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  images?: string[];
  price?: number;
  categoryId?: string;
}

export interface AuthResponse {
  token: string;
}

export interface PaginationParams {
  offset?: number;
  limit?: number;
}
