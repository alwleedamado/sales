import {Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import {catchError} from "rxjs/operators";
import { AbstractService } from './abstract.sevice';
@Injectable()
export class ProductsService extends AbstractService<Product> {

  constructor(http: HttpClient) {
    super(http, 'products')
  }
}

