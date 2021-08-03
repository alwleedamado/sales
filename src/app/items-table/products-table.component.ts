import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Product} from "../services/product.model";
import {MatDialog} from "@angular/material/dialog";
import {openDialog} from "../dialog.utils";
import {ToastrService} from "ngx-toastr";
import {MatPaginator} from "@angular/material/paginator";
import {Category, CategoryLookup} from "../services/category.model";
import {CategoryService} from "../services/category.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {ProductsService} from "../services/products.service";
import {ProductsModalComponent } from '../items-modal/products-modal.component';

@Component({
  selector: 'app-Products-table',
  templateUrl: './Products-table.component.html',
  styleUrls: ['./Products-table.component.scss']
})
export class ProductsTableComponent implements OnInit {
  Products: Product[] = [];
  displayedColumns: string[] = ['name', 'description', 'price','edit', 'delete'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>(this.Products);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private categories$: Observable<CategoryLookup[]>;

  constructor(private ProductService: ProductsService,
              private toastr: ToastrService,
              private dialog: MatDialog,
              private categoryService: CategoryService) {
    this.paginator = <MatPaginator>{};
    this.categories$ = this.categoryService.getAllCategories().pipe(
      map<Category[], CategoryLookup[]>(cat =>
        cat.map<CategoryLookup>(c => {
          return <CategoryLookup>{id: c.id, name: c.name};
        }))
    );
  }

  ngOnInit(): void {
    this.ProductService.getAllProducts().subscribe(data => {
        this.Products = data;
        this.dataSource = new MatTableDataSource<Product>(this.Products);
        this.dataSource.paginator = this.paginator;
      },
      err =>{
        console.error(err);
      });

  }

  openProductsDialog(data?: any) {

   openDialog(this.dialog, ProductsModalComponent,data);
  }

  deleteProduct(id: number) {
    this.ProductService.deleteProduct(id)
      .subscribe(data =>{
          this.toastr.success('Product deleted successfully ', 'Deletion', {timeOut: 300})

        },
        err => this.toastr.error('Product deletion failed ', 'Deletion failed'));
  }

  editProduct(id:number) {

    let Product = this.Products.find(m => m.id == id);
    let category : CategoryLookup | undefined;
    this.categories$
      .subscribe(s => {
        category = s.find(c => c.id == Product?.categoryId);
        let data = {Product,category, categories: this.categories$, formType: 'update'};console.log(category)
        this.openProductsDialog(data);
      })

  }

  addNewProduct() {
    let data = {categories: this.categories$};
    this.openProductsDialog(data);
  }
}