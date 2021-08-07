import {createFeatureSelector, createSelector} from "@ngrx/store";
import {AppState, CategoriesState} from "../app.state";
import {Category} from "../../services/category.model";

const categoriesFeature = createFeatureSelector<AppState, CategoriesState>('categories');

export const selectAllCategories =
  createSelector<AppState, CategoriesState, Category[]>(categoriesFeature,(state) =>  state.categoriesList)
