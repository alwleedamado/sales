import {Category} from "../models/category.model";
import {Invoice} from "../models/invoice.model";
import {Product} from "../models/product.model";
import {EntityState} from "@ngrx/entity";

export interface AppState {
  categories: GenericState<Category>;
  products: GenericState<Product>;
  invoices: InvoicesState;
}

export interface GenericState<T> {
  data: EntityState<T>;
  metaData: {
    removeRequestState: httpState;
    addRequestState: httpState;
    updateRequestState: httpState;
    ListLoadRequestState: httpState,
    error: any;
  }
}

export interface InvoicesState {
  invoicesList: Invoice[];
  selectedInvoice: Invoice
}


export enum httpState {
  idle,
  request,
  success,
  fail
}
