import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {LoadCategories, LoadCategoriesFailed, LoadCategoriesSuccess} from "../actions/categories.actions";
import {catchError, map, mergeMap, tap} from "rxjs/operators";
import {CategoryService} from "../../services/category.service";
import {of, throwError} from "rxjs";


@Injectable()
export class CategoriesEffects {
   categories$ = createEffect(() =>  this.actions$.pipe(
    ofType(LoadCategories),
    tap(() => console.log("effects")),
    mergeMap(() => this.categoryService.getAllCategories().pipe(
      tap(a => console.log(a)),
      map(categories => LoadCategoriesSuccess({ categories }),
        catchError(err => throwError(err))))
    ), catchError(err => of(LoadCategoriesFailed()))
  ));
  addCategory$ = this.actions$.pipe();
  constructor(private actions$: Actions, private categoryService: CategoryService) {}

}
