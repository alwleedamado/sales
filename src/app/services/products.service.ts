import {Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import {catchError} from "rxjs/operators";
@Injectable()
export class ProductsService {
  baseUrl = 'https://localhost:44381/api/Products';

  constructor(private http: HttpClient) {
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}`).pipe(
      catchError(ProductsService.handleError)
    );
  }

  getProductById(id: number) {
    return this.http.get<Product>(`${this.baseUrl}/${id}`).pipe(
      catchError(ProductsService.handleError)
    );;
  }
  addProduct(Product: Product) {
    return this.http.post<Product>(this.baseUrl, Product).pipe(
      catchError(ProductsService.handleError)
    );;
  }

  updateProduct(id: number, Product: Product) {
    return this.http.put(`${this.baseUrl}/${id}`, Product).pipe(
      catchError(ProductsService.handleError)
    );;
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(ProductsService.handleError)
    );
  }

  private static handleError(err: any, caught: Observable<any>): Observable<any> {
    return throwError(err);
  }
}

