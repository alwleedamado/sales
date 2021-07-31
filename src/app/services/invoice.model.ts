import { Item } from "./item.model";

export interface Invoice {
  id: number;
  issuedOn: Date;
  name: string;
  description: string;
  items: Item[],
  categoryId: number;
}
