import {createEntityAdapter, EntityAdapter} from "@ngrx/entity";
import {Category} from "../../models/category.model";

export const CategoryAdapter: EntityAdapter<Category> = createEntityAdapter()
