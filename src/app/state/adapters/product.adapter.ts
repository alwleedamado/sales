
import {createEntityAdapter, EntityAdapter} from "@ngrx/entity";
import {Product} from "../../models/product.model";

export const productAdapter: EntityAdapter<Product> = createEntityAdapter()
