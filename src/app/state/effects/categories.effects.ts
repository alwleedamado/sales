import { Injectable } from '@angular/core';
import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import {
  LoadCategories,
  LoadCategoriesFailed,
  LoadCategoriesSuccess,
  RemoveCategory, RemoveCategoryFailed, RemoveCategorySuccess
} from "../actions/categories.actions";
import {catchError, map, mergeMap, switchMap, tap} from "rxjs/operators";
import {CategoryService} from "../../services/category.service";
import {of, throwError} from "rxjs";


@Injectable()
export class CategoriesEffects {
  @Effect()
   categories$ = createEffect(() =>  this.actions$.pipe(
    ofType(LoadCategories),
    tap(() => console.log("effects")),
    mergeMap(() => this.categoryService.getAllCategories().pipe(
      tap(a => console.log(a)),
      map(categories => LoadCategoriesSuccess({ categories }),
        catchError(err => throwError(err))))
    ), catchError(err => of(LoadCategoriesFailed()))
  ));
  addCategory$ = createEffect(() => this.actions$
    .pipe(
      ofType(RemoveCategory),
      tap(() => console.log('ture')),
      switchMap((actionProps) => this.categoryService.deleteCategory(actionProps.categoryId)
        .pipe(
          tap((id) => console.log(id)),
        map(id => RemoveCategorySuccess(id),
          catchError(err => of(RemoveCategoryFailed(err)))
        ))
    ), catchError( err => of(RemoveCategoryFailed(err)))
    ));
  constructor(private actions$: Actions, private categoryService: CategoryService) {}

}
