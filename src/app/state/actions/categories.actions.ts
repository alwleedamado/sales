import {createAction, props} from "@ngrx/store";
import {Category} from "../../services/category.model";

export const LoadCategories = createAction('[Categories] load categories list');
export const LoadCategoriesFailed = createAction('[Categories] load categories list failed');
export const LoadCategoriesSuccess = createAction('[Categories] load categories list successes', props<{categories: Category[]}>());

export const AddCategory = createAction('[Categories] Add Category', props<{category: Category}>());
export const AddCategoryFailed = createAction('[Categories] Add Category failed', props<{err: any}>());
export const AddCategorySuccess = createAction('[Categories] Add Category success', props<{category: Category}>());

export const RemoveCategory = createAction('[Categories] Remove Category', props<{categoryId: number}>());
export const RemoveCategoryFailed = createAction('[Categories] Remove Category failed', props<{err: any}>());
export const RemoveCategorySuccess = createAction('[Categories] Remove Category success', props<{categoryId: number}>());

export const UpdateCategory = createAction('[Categories] Update Category', props<{category: Category}>());
export const UpdateCategoryFailed = createAction('[Categories] Update Category failed', props<{err: any}>());
export const UpdateCategorySuccess = createAction('[Categories] Update Category success', props<{id: number, category: Category}>());

export const ResetCategoriesRequestState = createAction('[Categories] Reset_Categories_Request_state')
export const ResetAddCategoryRequestState = createAction('[Categories] Reset_Add_Category_Request_state')
export const ResetRemoveCategoryRequestState = createAction('[Categories] Reset_Remove_Category_Request_state');
export const ResetUpdateCategoryRequestState = createAction('[Categories] Reset_Update_Category_Request_state');
