import {Action, createReducer, on} from "@ngrx/store";
import {Category} from "../services/category.model";
import {
  AddCategorySuccess,
  LoadCategoriesSuccess,
  RemoveCategoryFailed,
  RemoveCategorySuccess
} from './actions/categories.actions'
import produce from "immer";
import {CategoriesState, CategoryDeletionState} from "./app.state";

const categoriesInitialState = <CategoriesState>{
  categoriesList: [] as Category[],
  selectedCategory: <Category>{},
  categoryRemoved: {},
  lastAddedCategory: {}
}
const onCategoriesLoadedSuccessfully = (state: CategoriesState, {categories}: any): CategoriesState => {
  return produce(state, (proxy: any) => {
     proxy.categoriesList = categories
  })
}
const onRemoveCategorySuccess = (state: CategoriesState, {categoryId}: any ): CategoriesState => {
  return produce(state, (proxy: any) => {
    proxy.categoriesList = proxy.categoriesList.filter((c: Category) => c.id !== categoryId)
    proxy.categoryRemoved = {id: categoryId, deleted: true}
  })
}
const onRemoveCategoryFailed = (state: CategoriesState, {categoryId}: any ): CategoriesState => {
  return produce(state, (proxy: any) => {
    proxy.categoryRemoved = {id: categoryId, deleted: false}
  });
}
const onAddedCategorySuccess = (state: CategoriesState, {category}: any ): CategoriesState => {
  return produce(state, (proxy: any) => {
    proxy.lastAddedCategory = category;
    proxy.categoriesList.push(category);
  })
}

export const categoryReducer = createReducer<CategoriesState>(
  categoriesInitialState,
  on(LoadCategoriesSuccess, onCategoriesLoadedSuccessfully),
  on(RemoveCategorySuccess, onRemoveCategorySuccess),
  on(RemoveCategoryFailed, onRemoveCategoryFailed),
  on(AddCategorySuccess, onAddedCategorySuccess),
  //on(AddedCategoryFailed, AddedCategoryFailed),

);

export function categoriesReducer(state: CategoriesState, action: Action) {
  return categoryReducer(state, action);
}
