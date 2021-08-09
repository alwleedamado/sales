import {createFeatureSelector, createSelector} from "@ngrx/store";
import {AppState, CategoriesState, httpState} from "../app.state";
import {Category} from "../../models/category.model";
import {CategoryAdapter} from "../adapters/category.adapter";

const categoriesFeature = createFeatureSelector<AppState, CategoriesState>('categories');
const selectCategoryEntity = createSelector(categoriesFeature, (state) =>state.data)

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = CategoryAdapter.getSelectors();
export const selectAllCategories =
  createSelector(selectCategoryEntity, selectAll)

export const selectCategory = (categoryId: number) =>
  createSelector(
    selectAllCategories,
    (state) =>
      state.find(c => c.id == categoryId));

export const selectUpdateStatus = createSelector(categoriesFeature,
    (state) => state.metaData.categoryUpdateState);

export const selectCreateStatus = createSelector(
  categoriesFeature,
  state => state.metaData.categoryAddState);

export const selectCategoriesListLoading = createSelector(categoriesFeature, (state) => state.metaData.categoriesListLoadState === httpState.request)
export const selectAddCategoryLoading = createSelector(categoriesFeature, (state) => state.metaData.categoryAddState === httpState.request)
export const selectRemoveCategoryLoading = createSelector(categoriesFeature, (state) => state.metaData.categoryRemoveState === httpState.request)

export const selectRemoveStatus =
  createSelector(categoriesFeature,(state) =>  state.metaData.categoryRemoveState)
export const selectAddCategoryStatus =
  createSelector(categoriesFeature,(state) =>  state.metaData.categoryAddState)

