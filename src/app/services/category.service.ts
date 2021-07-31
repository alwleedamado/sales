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

  getCategoriesNames() {
    return this.http.get<Category[]>(this.baseUrl);
  }

  addCategory(category: Category) {
    return this.http.post<Category>(this.baseUrl, category);
  }

  updateCategory(id: number, category: Category) {
    return this.http.put(`${this.baseUrl}/${id}`,category);
  }
  deleteCategory(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  private static handleError(err: any, caught:Observable<Category>) : Observable<any>{
    return throwError(err);
  }
}
