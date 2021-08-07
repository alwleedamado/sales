import {Category} from "../services/category.model";
import {Invoice} from "../services/invoice.model";
import {Product} from "../services/product.model";

export interface AppState {
  categories: CategoriesState;
  produucts: ProductsState;
  invoices: InvoicesState;
}
export interface CategoriesState {
  categoriesList: Category[];
  selectedCategory: Category
}
interface ProductsState {
  productsList: Product[];
  selectedProduct: Product;
}

interface InvoicesState {
  invoicesList: Invoice[];
  selectedInvoice: Invoice
}
