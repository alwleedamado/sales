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
  selectedCategoryId: number;
  categoryRemoveState: httpState;
  categoryAddState: httpState;
  categoryUpdateState: httpState;
  categoriesListLoadState: httpState,
  error: any
}
interface ProductsState {
  productsList: Product[];
  selectedProduct: Product;
}

interface InvoicesState {
  invoicesList: Invoice[];
  selectedInvoice: Invoice
}


export enum httpState {
  idle,
  request,
  success,
  fail
}
