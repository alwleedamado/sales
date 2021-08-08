import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {
  AddCategory,
  AddCategoryFailed,
  AddCategorySuccess,
  LoadCategories,
  LoadCategoriesSuccess,
  RemoveCategory,
  RemoveCategoryFailed,
  RemoveCategorySuccess
} from "../actions/categories.actions";
import {catchError, concatMap, map, switchMap, tap} from "rxjs/operators";
import {CategoryService} from "../../services/category.service";
import {of, throwError} from "rxjs";


@Injectable()
export class CategoriesEffects {
  categories$ = createEffect(() => this.actions$.pipe(
    ofType(LoadCategories),
    tap(() => console.log("effects")),
    switchMap(() => this.categoryService.getAllCategories()
      .pipe(
        map(categories => LoadCategoriesSuccess({categories})),
        catchError(err => throwError(err)))
    )
  ));

  removeCategory$ = createEffect(() => this.actions$
    .pipe(
      ofType(RemoveCategory),
      switchMap((actionProps) => this.categoryService.deleteCategory(actionProps.categoryId)
        .pipe(
          map(id => RemoveCategorySuccess({categoryId: actionProps.categoryId})),
          catchError(err => of(RemoveCategoryFailed({categoryId: actionProps.categoryId})))
        )
      )
    ));

  addCategory$ = createEffect(() => this.actions$
    .pipe(
      ofType(AddCategory),
      concatMap((actionProps) => this.categoryService.addCategory(actionProps.category)
        .pipe(
          map(category => AddCategorySuccess({category})),
          catchError(err => of(AddCategoryFailed(err)))
        )
      )
    ));

  constructor(private actions$: Actions, private categoryService: CategoryService) {
  }

}
