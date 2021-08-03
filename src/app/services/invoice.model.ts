import { Category } from "./category.model";
import { Item } from "./item.model";

export interface InvoiceCategory {
  name: string;
}

export interface Invoice {
  id: number;
  notes: string;
  invoiceDate: Date;
  customerName: string;
  categoryId: number;
  category: Category;
  invoiceDetails: InvoiceDetail[];
  netAmount: number;
}

interface Product {
  name:string;
  id:number;
}

export interface InvoiceDetail {
  id?: number;
  name:string;
  quantity: number;
  product?: Product;
  productId: number;
  price: number;
  qty: number;
  discount: number;
  invoiceId?: number;
  netAmount: number;
}
