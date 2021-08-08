import {Injectable} from "@angular/core";
import {Observable, throwError} from "rxjs";
import {Category, CategoryLookup} from "./category.model";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {Product, ProductLookup} from "./product.model";

@Injectable()
export class CategoryService {
  baseUrl = 'https://localhost:44381/api/Categories';
  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(this.baseUrl).pipe(
      catchError(CategoryService.handleError)
    );
  }

  getCategoriesNames() {
    return this.http.get<Category[]>(this.baseUrl);
  }

  addCategory(category: Category) :Observable<Category>{
    return this.http.post<Category>(this.baseUrl, category).pipe(
      catchError(CategoryService.handleError)
    );;
  }

  updateCategory(id: number, category: Category) {
    return this.http.put(`${this.baseUrl}/${id}`,category).pipe(
      catchError(CategoryService.handleError)
    );;
  }
  deleteCategory(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(CategoryService.handleError)
    );;
  }

  private static handleError(err: any, caught:Observable<any>) : Observable<any>{
    return throwError(err);
  }

  getProducts(categoryId: number): Observable<ProductLookup[]> {
    console.log(`${this.baseUrl}/ProductsByCategoryId/${categoryId}`)
    return this.http.get<ProductLookup[]>(`${this.baseUrl}/ProductsByCategoryId/${categoryId}`)
      .pipe(
       map(l =>
           l.map(c => {
             return <CategoryLookup>{id: c.id, name: c.name};
           }))
        ,catchError(CategoryService.handleError));
  }
}
