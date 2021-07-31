import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from './item.model';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class ItemsService {
  baseUrl: string = '';

  constructor(private http: HttpClient){}
  getItemById(id: number) : Observable<Item> {
    return this.http.get<Item>(`${this.baseUrl}/${id}`);
  }
  getItems(categoryId: number) {
    return this.http.get<Item[]>(this.baseUrl);
  }


}
