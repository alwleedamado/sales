import {Action, createReducer, on} from "@ngrx/store";
import {Category} from "../services/category.model";
import {LoadCategoriesSuccess} from './actions/categories.actions'
import produce from "immer";
import {CategoriesState} from "./app.state";

const categoriesInitialState = <CategoriesState>{
  categoriesList: [] as Category[],
  selectedCategory: <Category>{}
}
const onCategoriesLoadedSuccessfully = (state: CategoriesState, {categories}: any): CategoriesState => {
  return produce(state, (proxy: any) => {
     proxy.categoriesList = categories
  })
}
const reducer = createReducer<CategoriesState>(
  categoriesInitialState,
  on(LoadCategoriesSuccess, onCategoriesLoadedSuccessfully)
);

export function categoriesReducer(state: CategoriesState, action: Action) {
  return reducer(state, action);
}
