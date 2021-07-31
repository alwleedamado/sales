import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Invoice} from "./invoice.model";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private baseurl: string = 'https://localhost:44381/api/Invoices';

  constructor(private http: HttpClient) { }

  getAllInvoices() : Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.baseurl);
  }
  getAllInvoiceById(id: number) : Observable<Invoice> {
    return this.http.get<Invoice>(`${this.baseurl}/${id}`);
  }

  addInvoice(invoice: Invoice) : Observable<Invoice> {
    return this.http.post<Invoice>(`${this.baseurl}`, invoice);
  }

  deleteInvoice(id: number)  {
    return this.http.delete(`${this.baseurl}/${id}`);
  }
}
