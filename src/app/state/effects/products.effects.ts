import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {
  AddProduct,
  AddProductFailed,
  AddProductSuccess,
  LoadProducts,
  LoadProductsSuccess,
  RemoveProduct,
  RemoveProductFailed,
  RemoveProductSuccess, UpdateProduct, UpdateProductFailed, UpdateProductSuccess
} from "../actions/products.actions";
import {catchError, concatMap, map, switchMap, tap} from "rxjs/operators";
import {of, throwError} from "rxjs";
import { ProductsService } from 'src/app/services/products.service';


@Injectable()
export class ProductsEffects {
  products$ = createEffect(() => this.actions$.pipe(
    ofType(LoadProducts),
    concatMap(() => this.productService.getAll()
      .pipe(
        map(list => LoadProductsSuccess({list})),
        catchError(err => throwError(err)))
    )
  ));

  removeProduct$ = createEffect(() => this.actions$
    .pipe(
      ofType(RemoveProduct),
      switchMap((actionProps) => this.productService.delete(actionProps.id)
        .pipe(
          map(id => RemoveProductSuccess({id: actionProps.id})),
          catchError(err => of(RemoveProductFailed({err})))
        )
      )
    ));

  addProduct$ = createEffect(() => this.actions$
    .pipe(
      ofType(AddProduct),
      concatMap((actionProps) => this.productService.add(actionProps.entity)
        .pipe(
          map(entity => AddProductSuccess({entity})),
          catchError(err => of(AddProductFailed({err})))
        )
      )
    ));

  updateProduct$ = createEffect(() => this.actions$
    .pipe(
      ofType(UpdateProduct),
      concatMap((actionProps) => this.productService.update(actionProps.entity.id, actionProps.entity)
        .pipe(
          tap(s => console.log(s)),
          map(entity => UpdateProductSuccess({id: actionProps.entity.id,entity:actionProps.entity})),
          catchError(err => of(UpdateProductFailed({err})))
        )
      )
    ));


  constructor(private actions$: Actions, private productService: ProductsService) {
  }

}
