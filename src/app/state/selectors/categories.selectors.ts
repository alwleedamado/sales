import { createFeatureSelector, createSelector, createSelectorFactory, defaultMemoize, DefaultProjectorFn, MemoizedSelector } from "@ngrx/store";
import { AppState, GenericState, httpState } from "../app.state";
import { Category } from "../../models/category.model";
import { CategoryAdapter } from "../adapters/category.adapter";
import { EntityAdapter, EntityState } from "@ngrx/entity";
import { Dictionary, EntitySelectors } from "@ngrx/entity/src/models";
import { GenericSelector } from "./generic.selector";

// const categoriesFeature = createFeatureSelector<AppState, GenericState<Category>>('categories');

// const selectCategoryEntity = createSelector(categoriesFeature, (state) => state.data)

// const {
//   selectAll,
//   selectEntities,
//   selectIds,
//   selectTotal,
// } = CategoryAdapter.getSelectors();

// export const selectAllCategories =
//   createSelector(selectCategoryEntity, selectAll)

// const selectAllEntities = createSelector(selectCategoryEntity, selectEntities);

// export const selectEntityById = (props: { id: number }) =>
//   createSelectorFactory<AppState, Category>(
//     () => defaultMemoize(
//       selectEntities,
//       (entities) => entities[props.id])
//   )();

// export const selectEntitiesByID = (props: any) =>
// createSelectorFactory<AppState, Category[]>(
//   () => defaultMemoize(
//     selectEntities,
//   (entities) => props.ids.map((id: string | number) => entities[id])
// ))();


// export const selectUpdateStatus = createSelector(categoriesFeature,
//   (state) => state.metaData.updateRequestState);

// export const selectCreateStatus = createSelector(
//   categoriesFeature,
//   state => state.metaData.addRequestState);

// export const selectCategoriesListLoading = createSelector(categoriesFeature,
//   (state) => state.metaData.ListLoadRequestState === httpState.request)
// export const selectAddCategoryLoading = createSelector(categoriesFeature,
//   (state) => state.metaData.removeRequestState === httpState.request)
// export const selectRemoveCategoryLoading = createSelector(categoriesFeature,
//   (state) => state.metaData.removeRequestState === httpState.request)

// export const selectRemoveStatus =
//   createSelector(categoriesFeature, (state) => state.metaData.removeRequestState)
// export const selectAddCategoryStatus =
//   createSelector(categoriesFeature, (state) => state.metaData.removeRequestState)


export const CategoriesSelector = new GenericSelector<Category>('categories', CategoryAdapter);
CategoriesSelector.initializeSelectors();
