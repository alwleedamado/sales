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
  RemoveCategorySuccess, UpdateCategory, UpdateCategoryFailed, UpdateCategorySuccess
} from "../actions/categories.actions";
import {catchError, concatMap, map, switchMap, tap} from "rxjs/operators";
import {CategoryService} from "../../services/category.service";
import {of, throwError} from "rxjs";


@Injectable()
export class CategoriesEffects {
  categories$ = createEffect(() => this.actions$.pipe(
    ofType(LoadCategories),
    concatMap(() => this.categoryService.getAll()
      .pipe(
        map(list => LoadCategoriesSuccess({list})),
        catchError(err => throwError(err)))
    )
  ));

  removeCategory$ = createEffect(() => this.actions$
    .pipe(
      ofType(RemoveCategory),
      switchMap((actionProps) => this.categoryService.delete(actionProps.categoryId)
        .pipe(
          map(id => RemoveCategorySuccess({categoryId: actionProps.categoryId})),
          catchError(err => of(RemoveCategoryFailed({err})))
        )
      )
    ));

  addCategory$ = createEffect(() => this.actions$
    .pipe(
      ofType(AddCategory),
      concatMap((actionProps) => this.categoryService.add(actionProps.entity)
        .pipe(
          map(entity => AddCategorySuccess({entity})),
          catchError(err => of(AddCategoryFailed({err})))
        )
      )
    ));

  updateCategory$ = createEffect(() => this.actions$
    .pipe(
      ofType(UpdateCategory),
      concatMap((actionProps) => this.categoryService.update(actionProps.category.id, actionProps.category)
        .pipe(
          tap(s => console.log(s)),
          map(entity => UpdateCategorySuccess({id: actionProps.category.id,entity:actionProps.category})),
          catchError(err => of(UpdateCategoryFailed({err})))
        )
      )
    ));


  constructor(private actions$: Actions, private categoryService: CategoryService) {
  }

}
