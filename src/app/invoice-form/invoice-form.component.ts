import {AfterViewInit, Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {validateConstructorDependencies} from "@angular/compiler-cli/src/ngtsc/annotations/src/util";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {Category, CategoryLookup} from "../models/category.model";
import {MatPaginator} from "@angular/material/paginator";
import {Product, ProductLookup} from "../models/product.model";
import {EMPTY, Observable} from "rxjs";
import {ProductsService} from "../services/products.service";
import {ToastrService} from "ngx-toastr";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CategoryService} from "../services/category.service";
import {Invoice, InvoiceDetail} from "../models/invoice.model";
import {InvoiceService} from "../services/invoice.service";
import {map, takeWhile} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-Products-modal',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss'],

})
export class InvoiceFormComponent implements OnInit,AfterViewInit,OnDestroy {
  invoiceForm: FormGroup;
  tableProducts: Product[] = [];
  // invoiceDetails: Product[] = [];

  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>(this.tableProducts);
  displayedColumns=['name','price','quantity','total','discount','net', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;
  categories$: Observable<CategoryLookup[]> = EMPTY;
  Products$: Observable<ProductLookup[]> = EMPTY;
  public invoiceProducts: InvoiceDetail[] = [];
  private netAmount: number = 0;
  private totalPrice: number = 0;
  invoiceTotalAmount: number = 0;
  invoiceTotalDiscount: number = 0;
  private active: boolean = true;
  ngAfterViewInit() {
  }
  constructor(
              private ProductsService: ProductsService,
              private invoiceService: InvoiceService,
              private categoryService: CategoryService,
              private toastr: ToastrService,
              private router: ActivatedRoute,
              private activatedRoute: ActivatedRoute) {
    let data: any;
    this.invoiceForm = new FormGroup({
      customerName: new FormControl({value: '', disabled:true}, Validators.required),
      description: new FormControl({value: '', disabled:true}, Validators.required),
      category: new FormControl({value: '', disabled:true}, Validators.required),
      issuedOn: new FormControl('', Validators.required),
      ProductName: new FormControl({value: '', disabled:true}, Validators.required),
      quantity: new FormControl({value: '', disabled:true}, Validators.required),
      discount: new FormControl(),
      price: new FormControl({value: '', disabled:true}, Validators.required),
      invoiceDetails: new FormArray([])
    });
    this.table = <MatTable<any>>{};
    this.paginator = <MatPaginator>{};

  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAll().pipe(
      map<Category[], CategoryLookup[]>(cat =>
        cat.map<CategoryLookup>(c => {
          return <CategoryLookup>{id: c.id, name: c.name};
        })
      )
    );
    let id = +this.activatedRoute.snapshot.params['id'];
    this.loadData(id)
  }
  get customerName() {
    return this.invoiceForm.get('customerName') as FormControl;
  }
  get description() {
    return this.invoiceForm.get('description') as FormControl;
  }
  get price() {
    return this.invoiceForm.get('price') as FormControl;
  }
  get category() {
    return this.invoiceForm.get('category') as FormControl;
  }
  get issuedOn() {
    return this.invoiceForm.get('issuedOn') as FormControl;
  }

  get quantity() {
    return this.invoiceForm.get('quantity') as FormControl;
  }
  get ProductName() {
    return this.invoiceForm.get('ProductName') as FormControl;
  }
  get discount() {
    return this.invoiceForm.get('discount') as FormControl;
  }
  get invoiceDetails() {
    return this.invoiceForm.get('invoiceDetails') as FormArray;
  }
  get invoiceDetailsControlsList(){
    return this.invoiceDetails.controls as FormGroup[];
  }

  loadData(id: number) {
    this.invoiceService.getInvoiceById(id).pipe(takeWhile(() => this.active)).subscribe(
      data => {
        console.log(data);
        this.category.setValue(data.category);
        this.issuedOn.setValue(data.invoiceDate);
        this.customerName.setValue(data.customerName);console.log(data.customerName)
        data.invoiceDetails.forEach(a => {
          this.invoiceDetailsControlsList.push(this.createGroup(a))
          this.invoiceTotalAmount += a.netAmount;
          this.invoiceTotalDiscount += a.discount;

          this.invoiceProducts.push(a);
        });

      }, error => {
        this.toastr.error('Invoice Invoice Id or internal error  ', 'Fetch Failed')

      }
    );
  }


  calculateNet(Product: InvoiceDetail): number {
    // @ts-ignore
    let i = Product.price * Product.qty - (Product.discount * Product.qty * Product.price / 100);
    return i;
  }
  calculateTotal(Product:InvoiceDetail){
    return Product.price * Product.qty;
  }
  displayName(categoryLookup:CategoryLookup): string {
    return categoryLookup !== null ? categoryLookup.name : '';
  }

   createGroup(Product: InvoiceDetail){
    console.log(Product);
    return new FormGroup({
      ProductId: new FormControl(Product.id),
      ProductName: new FormControl({ value: Product.product?.name, disabled: true}, Validators.required),
      quantity: new FormControl({ value: Product.qty, disabled: true}, Validators.required),
      discount: new FormControl({ value: Product.discount, disabled: true}),
      total: new FormControl({ value: this.calculateTotal(Product), disabled: true}),
      price: new FormControl({value: Product.price, disabled:true}, Validators.required),
      netAmount: new FormControl({value: this.calculateNet(Product), disabled: true})
    })
  }

  ngOnDestroy(): void {
    this.active = false;
  }

  calculateProductTotal(id: number) {
    const Product = this.invoiceProducts[id];
    const qty: number = Product.qty || 0;
    const price: number = Product.price;
    return qty * price;
  }
}
