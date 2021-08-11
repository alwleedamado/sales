import { EntityState, Dictionary, EntityAdapter } from "@ngrx/entity";
import { EntitySelectors } from "@ngrx/entity/src/models";
import { MemoizedSelector, DefaultProjectorFn, createFeatureSelector, createSelector, createSelectorFactory, defaultMemoize } from "@ngrx/store";
import { AppState, httpState, GenericState } from "../app.state";

export class GenericSelector<T> {
  selectUpdateStatus: MemoizedSelector<AppState, httpState, DefaultProjectorFn<httpState>>;
  selectCreateRequestStatus: MemoizedSelector<AppState, httpState, DefaultProjectorFn<httpState>>;
  selectlistLoadingStatus: MemoizedSelector<AppState, boolean, DefaultProjectorFn<boolean>>;
  selectAddLoadingStatus: MemoizedSelector<AppState, boolean, DefaultProjectorFn<boolean>>;
  selectRemoveLoadingStatus: MemoizedSelector<AppState, boolean, DefaultProjectorFn<boolean>>;
  selectRemoveRequestStatus: MemoizedSelector<AppState, httpState, DefaultProjectorFn<httpState>>;
  selectAddRequestStatus: MemoizedSelector<AppState, httpState, DefaultProjectorFn<httpState>>;
  featureEntityState: MemoizedSelector<AppState, EntityState<T>, DefaultProjectorFn<EntityState<T>>>;
  private entitySelectors: EntitySelectors<T, EntityState<T>>;
  featureSelector: MemoizedSelector<AppState, GenericState<T>, DefaultProjectorFn<GenericState<T>>>;

  selectAllEntities: MemoizedSelector<AppState, Dictionary<T>, DefaultProjectorFn<Dictionary<T>>>;
  selectAll: MemoizedSelector<AppState, T[], DefaultProjectorFn<T[]>>;
  constructor(featureName: keyof AppState, adpater: EntityAdapter<T>) {
    this.featureSelector = createFeatureSelector<AppState, GenericState<T>>(featureName);
    this.featureEntityState = createSelector(this.featureSelector, (state) => state.data);
    this.entitySelectors = adpater.getSelectors();
  }
  initializeSelectors() {
    this.selectAllEntities = createSelector(this.featureEntityState, this.entitySelectors.selectEntities);
    this.selectAll = createSelector(this.featureEntityState, this.entitySelectors.selectAll);
    this.selectUpdateStatus = createSelector(this.featureSelector,
      (state) => state.metaData.updateRequestState);

    this.selectCreateRequestStatus = createSelector(
      this.featureSelector,
      state => state.metaData.addRequestState);

    this.selectlistLoadingStatus = createSelector(this.featureSelector,
      (state) => state.metaData.ListLoadRequestState === httpState.request)

    this.selectAddLoadingStatus = createSelector(this.featureSelector,
      (state) => state.metaData.removeRequestState === httpState.request)

    this.selectRemoveLoadingStatus = createSelector(this.featureSelector,
      (state) => state.metaData.removeRequestState === httpState.request)

    this.selectRemoveRequestStatus =
      createSelector(this.featureSelector, (state) => state.metaData.removeRequestState)

    this.selectAddRequestStatus =
      createSelector(this.featureSelector, (state) => state.metaData.removeRequestState)
  }

  selectEntityById(id: number) {
    return createSelectorFactory<AppState, T>(
      () => defaultMemoize(
        this.selectAllEntities,
        (entities) => entities[id])
    )();
  }

  selectEntitiesByIds(ids: any) {
    return createSelectorFactory<AppState, T[]>(
      () => defaultMemoize(
        this.selectAllEntities,
        (entities) => ids.map((id: number) => entities[id])
      ))();
  }
}
