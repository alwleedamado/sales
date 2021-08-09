import { Category } from "./category.model";

export interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  price: number;
  category: Category;
}

export interface ProductLookup {
  id: number;
  name: string;
}
