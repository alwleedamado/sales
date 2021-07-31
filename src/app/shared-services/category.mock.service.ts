import {CategoryService} from "./category.service";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Category} from "./category.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryMockService {
  baseUrl: string = '';
  private categories: Category[] = [
    {name: 'Motorcycles', description: "Motorcycles and all its spares", id: 1},
    {name: 'Cars', description: "automobile category", id: 2},
    {name: 'Heavy', description: "heavy automobiles", id: 3}
  ];
  constructor(private http: HttpClient) {
  }
  addCategory(category: Category): Observable<Category> {
    this.categories.push(category);
    return of(category);
  }

  deleteCategory(id: number): Observable<Object> {
    return of();
  }

  getAllCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  getCategoriesNames(): Observable<{ id: number, name: string }[]> {
    let list = this.categories.map((m) =>  ({ id:m.id , name:m.name}));
    return of(list);
  }

  updateCategory(id: number, category: Category): Observable<Category | undefined> {
    let c =  this.categories.find(m => m.id == id);
    // @ts-ignore
    c.name = category.name;
    // @ts-ignore
    c.description = category.description;
    return of(c);
  }

}
