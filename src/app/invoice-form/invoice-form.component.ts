import {AfterViewInit, Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {validateConstructorDependencies} from "@angular/compiler-cli/src/ngtsc/annotations/src/util";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {Category, CategoryLookup} from "../services/category.model";
import {MatPaginator} from "@angular/material/paginator";
import {Item, ItemLookup} from "../services/item.model";
import {EMPTY, Observable} from "rxjs";
import {ItemsService} from "../services/items.service";
import {ToastrService} from "ngx-toastr";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CategoryService} from "../services/category.service";
import {Invoice, InvoiceDetail} from "../services/invoice.model";
import {InvoiceService} from "../services/invoice.service";
import {map, takeWhile} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-items-modal',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss'],

})
export class InvoiceFormComponent implements OnInit,AfterViewInit,OnDestroy {
  invoiceForm: FormGroup;
  tableItems: Item[] = [];
  // invoiceDetails: Item[] = [];

  dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>(this.tableItems);
  displayedColumns=['name','price','quantity','total','discount','net', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;
  categories$: Observable<CategoryLookup[]> = EMPTY;
  items$: Observable<ItemLookup[]> = EMPTY;
  public invoiceItems: InvoiceDetail[] = [];
  private netAmount: number = 0;
  private totalPrice: number = 0;
  invoiceTotalAmount: number = 0;
  invoiceTotalDiscount: number = 0;
  private active: boolean = true;
  ngAfterViewInit() {
  }
  constructor(
              private itemsService: ItemsService,
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
      itemName: new FormControl({value: '', disabled:true}, Validators.required),
      quantity: new FormControl({value: '', disabled:true}, Validators.required),
      discount: new FormControl(),
      price: new FormControl({value: '', disabled:true}, Validators.required),
      invoiceDetails: new FormArray([])
    });
    this.table = <MatTable<any>>{};
    this.paginator = <MatPaginator>{};

  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories().pipe(
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
  get itemName() {
    return this.invoiceForm.get('itemName') as FormControl;
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

          this.invoiceItems.push(a);
        });

      }, error => {
        this.toastr.error('Invoice Invoice Id or internal error  ', 'Fetch Failed')

      }
    );
  }


  calculateNet(item: InvoiceDetail): number {
    // @ts-ignore
    let i = item.price * item.qty - (item.discount * item.qty * item.price / 100);
    return i;
  }
  calculateTotal(item:InvoiceDetail){
    return item.price * item.qty;
  }
  displayName(categoryLookup:CategoryLookup): string {
    return categoryLookup !== null ? categoryLookup.name : '';
  }

   createGroup(item: InvoiceDetail){
    console.log(item);
    return new FormGroup({
      itemId: new FormControl(item.id),
      itemName: new FormControl({ value: item.product?.name, disabled: true}, Validators.required),
      quantity: new FormControl({ value: item.qty, disabled: true}, Validators.required),
      discount: new FormControl({ value: item.discount, disabled: true}),
      total: new FormControl({ value: this.calculateTotal(item), disabled: true}),
      price: new FormControl({value: item.price, disabled:true}, Validators.required),
      netAmount: new FormControl({value: this.calculateNet(item), disabled: true})
    })
  }

  ngOnDestroy(): void {
    this.active = false;
  }

  calculateItemTotal(id: number) {
    const item = this.invoiceItems[id];
    const qty: number = item.qty || 0;
    const price: number = item.price;
    return qty * price;
  }
}
