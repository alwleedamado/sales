import {createFeatureSelector, createSelector} from "@ngrx/store";
import {AppState, CategoriesState, CategoryDeletionState} from "../app.state";
import {Category} from "../../services/category.model";

const categoriesFeature = createFeatureSelector<AppState, CategoriesState>('categories');

export const selectAllCategories =
  createSelector<AppState, CategoriesState, Category[]>(categoriesFeature,(state) =>  state.categoriesList)

export const selectCategory = (categoryId: number) => createSelector(selectAllCategories,
  (state) =>{state.find(c => c.id == categoryId)})

export const selectLastCategory = createSelector(categoriesFeature,
    state => state.lastAddedCategory);

export const selectRemoveStatus =
  createSelector<AppState, CategoriesState, CategoryDeletionState>(categoriesFeature,(state) =>  state.categoryRemoved)

