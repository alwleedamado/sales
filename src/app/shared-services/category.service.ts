import {Injectable} from "@angular/core";
import {Observable, throwError} from "rxjs";
import {Category} from "./category.model";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError} from "rxjs/operators";

@Injectable()
export class CategoryService {
  baseUrl = 'http://localhost/api/categories';
  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category>{
    return this.http.get<Category>(this.baseUrl).pipe(
      catchError(CategoryService.handleError)
    );
}

  private static handleError(err: any, caught:Observable<Category>) : Observable<any>{
    return throwError(err);
  }
}
