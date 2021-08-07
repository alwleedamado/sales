import {Category} from "../services/category.model";
import {Invoice} from "../services/invoice.model";
import {Product} from "../services/product.model";

export interface AppState {
  categories: CategoriesState;
  products: ProductsState;
  invoices: InvoicesState;
}
export interface CategoriesState {
  categoriesList: Category[];
  selectedCategory: Category;
  categoryRemoved: CategoryDeletionState;
}
interface ProductsState {
  productsList: Product[];
  selectedProduct: Product;
}

interface InvoicesState {
  invoicesList: Invoice[];
  selectedInvoice: Invoice
}

export enum CategoryDeletionState {
  NotModified,
  Deleted
}
