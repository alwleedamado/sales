import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";

export class AbstractService<T> {
  protected url = 'https://localhost:44381/api/';
  constructor(private http: HttpClient, surl: string) {
    this.url = this.url + surl;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.url).pipe(
      catchError(AbstractService.handleError)
    );
  }
  get(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`).pipe(catchError(AbstractService.handleError))
  }

  add(category: T): Observable<T> {
    return this.http.post<T>(this.url, category).pipe(
      catchError(AbstractService.handleError)
    );;
  }

  update(id: number, category: T) {
    return this.http.put(`${this.url}/${id}`, category).pipe(
      catchError(AbstractService.handleError)
    );;
  }
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`).pipe(
      catchError(AbstractService.handleError)
    );;
  }


  private static handleError(err: any, caught: Observable<any>): Observable<any> {
    return throwError(err);
  }
}
