import {createAction, props} from "@ngrx/store";
import {Product} from "../../models/product.model";

export const LoadProducts = createAction('[Products] load products list');
export const LoadProductsFailed = createAction('[Products] load products list failed');
export const LoadProductsSuccess = createAction('[Products] load products list successes', props<{list: Product[]}>());

export const AddProduct = createAction('[Products] Add Product', props<{product: Product}>());
export const AddProductFailed = createAction('[Products] Add Product failed', props<{err: any}>());
export const AddProductSuccess = createAction('[Products] Add Product success', props<{entity: Product}>());

export const RemoveProduct = createAction('[Products] Remove Product', props<{id: number}>());
export const RemoveProductFailed = createAction('[Products] Remove Product failed', props<{err: any}>());
export const RemoveProductSuccess = createAction('[Products] Remove Product success', props<{id: number}>());

export const UpdateProduct = createAction('[Products] Update Product', props<{entity: Product}>());
export const UpdateProductFailed = createAction('[Products] Update Product failed', props<{err: any}>());
export const UpdateProductSuccess = createAction('[Products] Update Product success', props<{id: number, entity: Product}>());

export const ResetProductsRequestState = createAction('[Products] Reset_Products_Request_state')
export const ResetAddProductRequestState = createAction('[Products] Reset_Add_Product_Request_state')
export const ResetRemoveProductRequestState = createAction('[Products] Reset_Remove_Product_Request_state');
export const ResetUpdateProductRequestState = createAction('[Products] Reset_Update_Product_Request_state');
