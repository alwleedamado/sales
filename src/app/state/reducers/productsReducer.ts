import {createReducer} from "@ngrx/store";

const productsInitialState = {
  productsList: [],
  selectedProduct: null
}

export const productsReducer = createReducer(productsInitialState);
