import {Action, createReducer, on} from "@ngrx/store";
import {Product} from "../../models/product.model";
import {
  AddProduct,
  AddProductFailed,
  AddProductSuccess,
  LoadProducts,
  LoadProductsFailed,
  LoadProductsSuccess,
  RemoveProduct,
  RemoveProductFailed,
  RemoveProductSuccess,
  ResetAddProductRequestState,
  ResetProductsRequestState,
  ResetRemoveProductRequestState,
  ResetUpdateProductRequestState,
  UpdateProduct,
  UpdateProductFailed,
  UpdateProductSuccess
} from '../actions/products.actions'
import {GenericState, httpState} from "../app.state";
import {productAdapter} from "../adapters/product.adapter";
import { GenericReducer } from "./generic.reducer";

export const productsHandler = new GenericReducer<Product>(productAdapter);


export const productReducer = createReducer(
  productsHandler.getInitalState(),
  on(LoadProducts, state => productsHandler.setListLoadRequestState(state, httpState.request)),
  on(AddProduct, state => productsHandler.setAddRequestState(state, httpState.request)),
  on(RemoveProduct, state => productsHandler.setRemoveRequestState(state, httpState.request)),
  on(UpdateProduct, state => productsHandler.setUpdateRequestState(state, httpState.request)),
  on(ResetProductsRequestState, state => productsHandler.setListLoadRequestState(state, httpState.idle)),
  on(ResetAddProductRequestState, state => productsHandler.setAddRequestState(state, httpState.idle)),
  on(ResetRemoveProductRequestState, state => productsHandler.setRemoveRequestState(state, httpState.idle)),
  on(ResetUpdateProductRequestState, state => productsHandler.setUpdateRequestState(state, httpState.idle)),

  on(LoadProductsSuccess, productsHandler.onListLoadSuccess),
  on(LoadProductsFailed, productsHandler.onListLoadFailed),
  on(RemoveProductSuccess, productsHandler.onRemoveSuccess),
  on(RemoveProductFailed, productsHandler.onRemoveFailed),
  on(AddProductSuccess, productsHandler.onAddSuccess),
  on(AddProductFailed, productsHandler.onAddFailed),
  on(UpdateProductSuccess, productsHandler.onUpdateSuccess),
  on(UpdateProductFailed, productsHandler.onUpdateFailed)
);

 function productsReducer(state: GenericState<Product>, action: Action) {
  return productReducer(state, action);
}
