import {createAction, props} from "@ngrx/store";
import {Category} from "../../services/category.model";

export const LoadCategories = createAction('[Categories] load categories list');
export const LoadCategoriesFailed = createAction('[Categories] load categories list');
export const LoadCategoriesSuccess = createAction('[Categories] load categories list successes', props<{categories: Category[]}>());

export const AddCategory = createAction('[Categories] Add Category', props<{category: Category}>());
export const AddCategoryFailed = createAction('[Categories] Add Category', props<{category: Category}>());
export const AddCategorySuccess = createAction('[Categories] Add Category', props<{category: Category}>());

export const RemoveCategory = createAction('[Categories] Remove Category', props<{category: Category}>());
export const RemoveCategoryFailed = createAction('[Categories] Remove Category', props<{categoryId: number}>());
export const RemoveCategorySuccess = createAction('[Categories] Remove Category', props<{category: Category}>());

export const UpdateCategory = createAction('[Categories] Update Category', props<{category: Category}>());
export const UpdateCategoryFailed = createAction('[Categories] Update Category', props<{category: Category}>());
export const UpdateCategorySuccess = createAction('[Categories] Update Category', props<{category: Category}>());

export const SetCurrentCategory = createAction('[Categories] Set Current Category', props<{categoryId: number}>());
