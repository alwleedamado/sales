import {Action, createReducer, on} from "@ngrx/store";
import {Category} from "../services/category.model";
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
  ResetCategoriesRequestState, ResetRemoveCategoryRequestState, ResetUpdateCategoryRequestState,
  UpdateCategory,
  UpdateCategoryFailed,
  UpdateCategorySuccess
} from './actions/categories.actions'
import produce from "immer";
import {CategoriesState, httpState} from "./app.state";

const categoriesInitialState = <CategoriesState>{
  categoriesList: [] as Category[],
  selectedCategoryId: 0,
  categoryRemoveState: httpState.idle,
  categoryAddState: httpState.idle,
  categoryUpdateState: httpState.idle,
  categoriesListLoadState: httpState.idle
}
const onCategoriesLoadedSuccessfully = (state: CategoriesState, {categories}: any): CategoriesState => {
  return produce(state, (proxy: any) => {
     proxy.categoriesList = categories;
     proxy.categoriesListLoadState = httpState.success
  })
}
const onCategoriesLoadFailed = (state: CategoriesState, {err}: any): CategoriesState => {
  return produce(state, (proxy: any) => {
    proxy.categoriesListLoadState = httpState.fail;
    proxy.error = err;
  })
}
const onRemoveCategorySuccess = (state: CategoriesState, {categoryId}: any ): CategoriesState => {
  return produce(state, (proxy: any) => {
    proxy.categoriesList = proxy.categoriesList.filter((c: Category) => c.id !== categoryId)
    proxy.categoryRemoveState = httpState.success
  })
}
const onRemoveCategoryFailed = (state: CategoriesState, {err}: any ): CategoriesState => {
  return produce(state, (proxy: any) => {
    proxy.categoryRemoveState = httpState.fail;
    proxy.error = err
  });
}
const onAddedCategorySuccess = (state: CategoriesState, {category}: any ): CategoriesState => {
  return produce(state, (proxy: any) => {
    proxy.lastAddedCategory = {id: category.id, success: false}
    proxy.categoriesList.push(category);
    proxy.categoryAddState = httpState.success;
  })
}

export const onAddedCategoryFailed = (state: CategoriesState, {err}) => {
  return produce(state, (proxy: any) => {
    proxy.categoryAddState = httpState.fail;
    proxy.error = err;
  })
}
export const onUpdateCategorySuccess = (state: CategoriesState, {id, category}) => {
  return produce(state, (proxy: any) => {
    proxy.categoriesList = proxy.categoriesList.map(c => c.id === id ? category: c)
    proxy.categoryUpdateState = httpState.success;
  })
}

const onUpdateCategoryFailed = (state: CategoriesState, {err}: any)  => {
  return produce(state, (proxy: any) => {
    proxy.categoryUpdateState = httpState.fail;
    proxy.error = err;
  })
}

export const categoryReducer = createReducer<CategoriesState>(
  categoriesInitialState,
  on(LoadCategories, (state, s) => ({...state, categoriesListLoadState: httpState.request})),
  on(AddCategory, (state, s) => ({...state, categoryAddState: httpState.request})),
  on(RemoveCategory, (state, s) => ({...state, categoryRemoveState: httpState.request})),
  on(UpdateCategory, (state, s) => ({...state, categoryUpdateState: httpState.request})),
  on(ResetCategoriesRequestState, (state, s) => ({...state, categoriesListLoadState: httpState.idle})),
  on(ResetAddCategoryRequestState, (state, s) => ({...state, categoryAddState: httpState.idle})),
  on(ResetRemoveCategoryRequestState, (state, s) => ({...state, categoryRemoveState: httpState.idle})),
  on(ResetUpdateCategoryRequestState, (state, s) => ({...state, categoryUpdateState: httpState.idle})),

  on(LoadCategoriesSuccess, onCategoriesLoadedSuccessfully),
  on(LoadCategoriesFailed, onCategoriesLoadFailed),
  on(RemoveCategorySuccess, onRemoveCategorySuccess),
  on(RemoveCategoryFailed, onRemoveCategoryFailed),
  on(AddCategorySuccess, onAddedCategorySuccess),
  on(AddCategoryFailed, onAddedCategoryFailed),
  on(UpdateCategorySuccess, onUpdateCategorySuccess),
  on(UpdateCategoryFailed, onUpdateCategoryFailed)
);

export function categoriesReducer(state: CategoriesState, action: Action) {
  return categoryReducer(state, action);
}
