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
import produce from "immer";
import {CategoriesState, httpState} from "../app.state";
import {CategoryAdapter} from "../adapters/category.adapter";
import {setup} from "@angular-devkit/build-angular/src/utils/process-bundle";

const categoriesInitialState: CategoriesState = {
  data: CategoryAdapter.getInitialState(),
  metaData: {
    categoriesListLoadState: httpState.idle,
    categoryUpdateState: httpState.idle,
    categoryAddState: httpState.idle,
    categoryRemoveState: httpState.idle,
    error: null
  }
};

const onCategoriesLoadedSuccessfully = (state: CategoriesState, { categories }: any): CategoriesState => {
  return produce(state, (proxy: any) => {
    proxy.data = CategoryAdapter.addMany(categories, state.data);
    proxy.metaData.categoriesListLoadState = httpState.success;
  });
}
const onCategoriesLoadFailed = (state: CategoriesState, {err}: any): CategoriesState => {
  return produce(state, (proxy: any) => {
    proxy.categoriesListLoadState = httpState.fail;
    proxy.metaData.error = err;
  })
}
const onRemoveCategorySuccess = (state: CategoriesState, {categoryId}: any ): CategoriesState => {
  return produce(state, (proxy: any) => {
    proxy.data = CategoryAdapter.removeOne(categoryId, state.data);
    proxy.metaData.categoryRemoveState = httpState.success
  })
}
const onRemoveCategoryFailed = (state: CategoriesState, {err}: any ): CategoriesState => {
  return produce(state, (proxy: any) => {
    proxy.categoryRemoveState = httpState.fail;
    proxy.metaData.error = err
  });
}
const onAddedCategorySuccess = (state: CategoriesState, {category}: any ): CategoriesState => {
  return produce(state, (proxy: any) => {
    proxy.data = CategoryAdapter.addOne(category, state.data);
    proxy.metaData.categoryAddState = httpState.success;
  })
}

export const onAddedCategoryFailed = (state: CategoriesState, {err}) => {
  return produce(state, (proxy: any) => {
    proxy.metaData.categoryAddState = httpState.fail;
    proxy.metaData.error = err;
  })
}
export const onUpdateCategorySuccess = (state: CategoriesState, {id, category}) => {
  return produce(state, (proxy: any) => {
    proxy.data = CategoryAdapter.updateOne(category, state.data);
    proxy.metaData.categoryUpdateState = httpState.success;
  })
}

const onUpdateCategoryFailed = (state: CategoriesState, {err}: any)  => {
  return produce(state, (proxy: any) => {
    proxy.metaData.categoryUpdateState = httpState.fail;
    proxy.error = err;
  })
}
function setAddRequestState(state: CategoriesState,requestState: httpState) {
  return produce(state, (proxy: any) => {
    proxy.metaData.categoryAddState = requestState;
  })
}
function setRemoveRequestState(state: CategoriesState,requestState: httpState) {
  return produce(state, (proxy: any) => {
    proxy.metaData.categoryRemoveState = requestState;
  })
}
function setUpdateRequestState(state: CategoriesState,requestState: httpState) {
  return produce(state, (proxy: any) => {
    proxy.metaData.categoryUpdateState = requestState;
  })
}
function setCategoriesLoadRequestState(state: CategoriesState,requestState: httpState) {
  return produce(state, (proxy: any) => {
    proxy.metaData.categoriesListLoadState = requestState;
  })
}

export const categoryReducer = createReducer(
  categoriesInitialState,
  on(LoadCategories, state => setCategoriesLoadRequestState(state, httpState.request)),
  on(AddCategory, state => setAddRequestState(state, httpState.request)),
  on(RemoveCategory, state => setRemoveRequestState(state, httpState.request)),
  on(UpdateCategory, state => setUpdateRequestState(state, httpState.request)),
  on(ResetCategoriesRequestState, state => setCategoriesLoadRequestState(state, httpState.idle)),
  on(ResetAddCategoryRequestState, state => setAddRequestState(state, httpState.idle)),
  on(ResetRemoveCategoryRequestState, state => setRemoveRequestState(state, httpState.idle)),
  on(ResetUpdateCategoryRequestState, state => setUpdateRequestState(state, httpState.idle)),

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
