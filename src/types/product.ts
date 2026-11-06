export type ProductCategory =
  | "smartphones"
  | "laptops"
  | "tablets"
  | "mobile-accessories";

export interface Product {
  id: number;
  title: string;
  description: string;
  category: ProductCategory;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface ProductList {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductQuery {
  q?: string;
  category?: ProductCategory;
  limit?: number;
  skip?: number;
  sortBy?: "price" | "rating" | "title";
  order?: "asc" | "desc";
}
