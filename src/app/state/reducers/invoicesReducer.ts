import {createReducer} from "@ngrx/store";
import {Category} from "../../models/category.model";

const invoicesInitialState = {
  invoicesList: [],
  selectedInvoice: null
}

export const invoicesReducer = createReducer(invoicesInitialState);
