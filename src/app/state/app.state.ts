import {Category} from "../models/category.model";
import {Invoice} from "../models/invoice.model";
import {Product} from "../models/product.model";
import {EntityState} from "@ngrx/entity";

export interface AppState {
  categories: CategoriesState;
  products: ProductsState;
  invoices: InvoicesState;
}

export interface CategoriesState{
  data: EntityState<Category>;
  metaData: {
    categoryRemoveState: httpState;
    categoryAddState: httpState;
    categoryUpdateState: httpState;
    categoriesListLoadState: httpState,
    error: any;
  }
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
