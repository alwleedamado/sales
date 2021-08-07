import {Action, createReducer, on} from "@ngrx/store";
import {Category} from "../services/category.model";
import {LoadCategoriesSuccess, RemoveCategoryFailed, RemoveCategorySuccess} from './actions/categories.actions'
import produce from "immer";
import {CategoriesState, CategoryDeletionState} from "./app.state";

const categoriesInitialState = <CategoriesState>{
  categoriesList: [] as Category[],
  selectedCategory: <Category>{},
  categoryRemoved: CategoryDeletionState.NotModified
}
const onCategoriesLoadedSuccessfully = (state: CategoriesState, {categories}: any): CategoriesState => {
  return produce(state, (proxy: any) => {
     proxy.categoriesList = categories
  })
}
const onRemoveCategorySuccess = (state: CategoriesState, {categoryId}: any ): CategoriesState => {
  return produce(state, (proxy: any) => {
    proxy.categoriesList = proxy.categoriesList.filter((c: Category) => c.id !== categoryId)
    proxy.categoryRemoved = CategoryDeletionState.Deleted;
  })
}
const onRemoveCategoryFailed = (state: CategoriesState, {categoryId}: any ): CategoriesState => {
  return produce(state, (proxy: any) => {
    proxy.categoryRemoved = CategoryDeletionState.NotModified;
  });
}
export const categoryReducer = createReducer<CategoriesState>(
  categoriesInitialState,
  on(LoadCategoriesSuccess, onCategoriesLoadedSuccessfully),
  on(RemoveCategorySuccess, onRemoveCategorySuccess),
  on(RemoveCategoryFailed, onRemoveCategoryFailed)
);

export function categoriesReducer(state: CategoriesState, action: Action) {
  return categoryReducer(state, action);
}
