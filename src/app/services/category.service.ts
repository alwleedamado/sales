import {Injectable} from "@angular/core";
import {Category} from "../models/category.model";
import {HttpClient} from "@angular/common/http";
import { AbstractService } from "./abstract.sevice";

@Injectable()
export class CategoryService extends AbstractService<Category> {
  constructor(http: HttpClient) {
    super(http, 'categories');
   }
}
