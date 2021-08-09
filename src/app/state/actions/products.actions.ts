import {createAction, props} from "@ngrx/store";
import { Product } from "../../models/product.model";

export const LoadProducts = createAction('[Products] load Products list');
export const LoadProductsFailed = createAction('[Products] load Products list Failed');
export const LoadProductsSuccess = createAction('[Products] load Products list successes', props<{Products: Product[]}>());

export const AddProduct = createAction('[Products] Add Product', props<{Product: Product}>());
export const AddProductFailed = createAction('[Products] Add Product Failed', props<{Product: Product}>());
export const AddProductSuccess = createAction('[Products] Add Product Success', props<{Product: Product}>());

export const RemoveProduct = createAction('[Products] Remove Product', props<{Product: Product}>());
export const RemoveProductFailed = createAction('[Products] Remove Product Failed', props<{ProductId: number}>());
export const RemoveProductSuccess = createAction('[Products] Remove Product Success', props<{productId: number}>());

export const UpdateProduct = createAction('[Products] Update Product', props<{Product: Product}>());
export const UpdateProductFailed = createAction('[Products] Update Product Failed', props<{ProductId: number}>());
export const UpdateProductSuccess = createAction('[Products] Update Product Success', props<{Product: Product}>());

export const SetCurrentProduct = createAction('[Products] Set Current Product', props<{productId: number}>());
