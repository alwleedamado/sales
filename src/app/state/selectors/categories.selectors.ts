import { Category } from "../../models/category.model";
import { CategoryAdapter } from "../adapters/category.adapter";
import { GenericSelector } from "./generic.selector";

export const CategoriesSelector = new GenericSelector<Category>('categories', CategoryAdapter);
CategoriesSelector.initializeSelectors();
