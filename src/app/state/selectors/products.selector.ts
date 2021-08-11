import { Product } from "src/app/models/product.model";
import { productAdapter } from "../adapters/product.adapter";
import { GenericSelector } from "./generic.selector";

export const productsSelector = new GenericSelector<Product>('products', productAdapter);
productsSelector.initializeSelectors();
