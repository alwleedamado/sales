export interface Item {
  id?: number;
  description: string;
  categoryId?: number;
  price: number;
  quantity?: number;
  name: string;
  discount: number;
  netAmount: number;
}
export interface ItemLookup {
  id: number;
  name: string;
}
