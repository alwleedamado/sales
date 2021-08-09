import { Category } from "./category.model";
import { Product } from "./product.model";

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


export interface InvoiceDetail {
  totalPrice?: number;
  name?: string;
  id?: number;
  productId: number;
  price: number;
  qty: number;
  discount: number;
  invoiceId: number;
  product?: Product;
  netAmount: number;
}
