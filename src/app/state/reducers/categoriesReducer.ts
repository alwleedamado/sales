import {Action, createReducer, on} from "@ngrx/store";
import {Category} from "../../models/category.model";
import {
  AddCategory,
  AddCategoryFailed,
  AddCategorySuccess,
  LoadCategories,
  LoadCategoriesFailed,
  LoadCategoriesSuccess,
  RemoveCategory,
  RemoveCategoryFailed,
  RemoveCategorySuccess,
  ResetAddCategoryRequestState,
  ResetCategoriesRequestState,
  ResetRemoveCategoryRequestState,
  ResetUpdateCategoryRequestState,
  UpdateCategory,
  UpdateCategoryFailed,
  UpdateCategorySuccess
} from '../actions/categories.actions'
import {GenericState, httpState} from "../app.state";
import {CategoryAdapter} from "../adapters/category.adapter";
import { GenericReducer } from "./generic.reducer";

export const categorieshandler = new GenericReducer<Category>(CategoryAdapter);


export const categoryReducer = createReducer(
  categorieshandler.getInitalState(),
  on(LoadCategories, state => categorieshandler.setListLoadRequestState(state, httpState.request)),
  on(AddCategory, state => categorieshandler.setAddRequestState(state, httpState.request)),
  on(RemoveCategory, state => categorieshandler.setRemoveRequestState(state, httpState.request)),
  on(UpdateCategory, state => categorieshandler.setUpdateRequestState(state, httpState.request)),
  on(ResetCategoriesRequestState, state => categorieshandler.setListLoadRequestState(state, httpState.idle)),
  on(ResetAddCategoryRequestState, state => categorieshandler.setAddRequestState(state, httpState.idle)),
  on(ResetRemoveCategoryRequestState, state => categorieshandler.setRemoveRequestState(state, httpState.idle)),
  on(ResetUpdateCategoryRequestState, state => categorieshandler.setUpdateRequestState(state, httpState.idle)),

  on(LoadCategoriesSuccess, categorieshandler.onListLoadSuccess),
  on(LoadCategoriesFailed, categorieshandler.onListLoadFailed),
  on(RemoveCategorySuccess, categorieshandler.onRemoveSuccess),
  on(RemoveCategoryFailed, categorieshandler.onRemoveFailed),
  on(AddCategorySuccess, categorieshandler.onAddSuccess),
  on(AddCategoryFailed, categorieshandler.onAddFailed),
  on(UpdateCategorySuccess, categorieshandler.onUpdateSuccess),
  on(UpdateCategoryFailed, categorieshandler.onUpdateFailed)
);

export function categoriesReducer(state: GenericState<Category>, action: Action) {
  return categoryReducer(state, action);
}
