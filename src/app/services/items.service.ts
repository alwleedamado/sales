import {Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { Item } from './item.model';
import { HttpClient } from '@angular/common/http';
import {catchError} from "rxjs/operators";
@Injectable()
export class ItemsService {
  baseUrl = 'https://localhost:44381/api/Products';

  constructor(private http: HttpClient) {
  }

  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}`).pipe(
      catchError(ItemsService.handleError)
    );
  }

  getItemById(id: number) {
    return this.http.get<Item>(`${this.baseUrl}/${id}`).pipe(
      catchError(ItemsService.handleError)
    );;
  }
  addItem(Item: Item) {
    return this.http.post<Item>(this.baseUrl, Item).pipe(
      catchError(ItemsService.handleError)
    );;
  }

  updateItem(id: number, Item: Item) {
    return this.http.put(`${this.baseUrl}/${id}`, Item).pipe(
      catchError(ItemsService.handleError)
    );;
  }

  deleteItem(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(ItemsService.handleError)
    );;
  }

  private static handleError(err: any, caught: Observable<any>): Observable<any> {
    return throwError(err);
  }
}

