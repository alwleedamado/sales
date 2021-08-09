import {createFeatureSelector, createSelector} from "@ngrx/store";
import {AppState, CategoriesState, httpState} from "../app.state";
import {Category} from "../../services/category.model";

const categoriesFeature = createFeatureSelector<AppState, CategoriesState>('categories');

export const selectAllCategories =
  createSelector<AppState, CategoriesState, Category[]>(categoriesFeature,(state) =>  state.categoriesList)

export const selectCategory = (categoryId: number) =>
  createSelector(
    selectAllCategories,
    (state) =>
      state.find(c => c.id == categoryId));

export const selectUpdateStatus = createSelector(categoriesFeature,
    (state) => state.categoryUpdateState);

export const selectCreateStatus = createSelector(
  categoriesFeature,
  state => state.categoryAddState);
export const selectCategoriesListLoading = createSelector(categoriesFeature, (state) => state.categoriesListLoadState === httpState.request)
export const selectAddCategoryLoading = createSelector(categoriesFeature, (state) => state.categoryAddState === httpState.request)
export const selectRemoveCategoryLoading = createSelector(categoriesFeature, (state) => state.categoryRemoveState === httpState.request)

export const selectRemoveStatus =
  createSelector(categoriesFeature,(state) =>  state.categoryRemoveState)
export const selectAddCategoryStatus =
  createSelector(categoriesFeature,(state) =>  state.categoryAddState)

