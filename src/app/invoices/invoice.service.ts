import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private baseurl: string = '';

  constructor(private http: HttpClient) { }

  getAllItems(categoryId: number) : Observable<any> {
    return this.http.get(this.baseurl);
  }
}
