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
import {ProductsModalComponent} from '../items-modal/products-modal.component';
import {FormControl, FormGroup} from "@angular/forms";
import {MatSort} from "@angular/material/sort";
import {DialogStatus} from "../enums/dialog-status.enum";
import {FormType} from "../enums/formType";

@Component({
  selector: 'app-Products-table',
  templateUrl: './Products-table.component.html',
  styleUrls: ['./Products-table.component.scss']
})
export class ProductsTableComponent implements OnInit {
  Products: Product[] = [];
  displayedColumns: string[] = ['name', 'category', 'price', 'edit', 'delete'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>(this.Products);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public categories$: Observable<CategoryLookup[]>;
  private invoiceForm: FormGroup;
  public flitteredProducts: Product[] = [];

  constructor(private ProductService: ProductsService,
              private toastr: ToastrService,
              private dialog: MatDialog,
              private categoryService: CategoryService) {
    this.paginator = <MatPaginator>{};
    this.sort = <MatSort>{};

    this.categories$ = this.categoryService.getAllCategories().pipe(
      map<Category[], CategoryLookup[]>(cat =>
        cat.map<CategoryLookup>(c => {
          return <CategoryLookup>{id: c.id, name: c.name};
        }))
    );
    this.invoiceForm = new FormGroup({
      category: new FormControl()
    })
  }

  get category() {
    return this.invoiceForm.get('category') as FormControl;
  }

  ngOnInit(): void {
    this.ProductService.getAllProducts().subscribe(data => {
        this.Products = data;
        this.flitteredProducts = data.filter(f => f.categoryId === 1);
        this.dataSource = new MatTableDataSource<Product>(this.Products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => {
        console.error(err);
      });

  }

  openProductsDialog(data?: any) {

    openDialog(this.dialog, ProductsModalComponent, data).afterClosed()
      .subscribe(ret => {
        if (ret) {
          if (ret === DialogStatus.updateSuccess)
            this.toastr.success('Product Updated successfully ', 'Update', {timeOut: 1700});
          else if (ret === DialogStatus.createSuccess)
            this.toastr.success('Product Created successfully ', 'Create', {timeOut: 1700});
          else if (ret === DialogStatus.updateFailed)
            this.toastr.error('Product Updated Failed ', 'Update', {timeOut: 1700});
          else if (ret === DialogStatus.createFailed)
            this.toastr.error('Product Created Failed ', 'Create', {timeOut: 1700});
        }
        this.ngOnInit();
      });
  }

  deleteProduct(id: number) {
    let result = confirm("Confirm the deletion operation");
    if (result)
      this.ProductService.deleteProduct(id)
        .subscribe(data => {
            this.toastr.success('Product deleted successfully ', 'Deletion', {timeOut: 1700})
            this.dataSource.data = this.dataSource.data.filter(x => x.id != id)
          },
          err => this.toastr.error('Cannot delete product that is a part of an invoice ', 'Deletion failed', {timeOut: 1700}));
  }

  editProduct(id: number) {

    let product = this.Products.find(m => m.id == id);
    let category: CategoryLookup | undefined;
    this.categories$
      .subscribe(s => {
        category = s.find(c => c.id == product?.categoryId);
        let data = {product, category, categories: this.categories$, formType: FormType.Edit};
        this.openProductsDialog(data);
      }, err => this.toastr.error('Failed to fetch data from the server', 'Network Error'))

  }

  addNewProduct() {
    let data = {categories: this.categories$, formType: FormType.Create};
    this.openProductsDialog(data);
  }

  displayName(categoryLookup: CategoryLookup): string {
    return categoryLookup !== null ? categoryLookup.name : '';
  }

  updateProductsList() {
    this.flitteredProducts = this.Products.filter(f => f.categoryId === this.category.value.id);
    this.dataSource = new MatTableDataSource<Product>(this.flitteredProducts);

  }
}
