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
import {takeWhile} from "rxjs/operators";

@Component({
  selector: 'app-items-modal',
  templateUrl: './invoice-modal.component.html',
  styleUrls: ['./invoice-modal.component.scss'],

})
export class InvoiceModalComponent implements OnInit,AfterViewInit,OnDestroy {
  invoiceForm: FormGroup;
  tableItems: InvoiceDetail[] = [];
 // invoiceDetails: Item[] = [];

  dataSource: MatTableDataSource<InvoiceDetail> = new MatTableDataSource<InvoiceDetail>(this.tableItems);
  displayedColumns=['name','price','quantity','discount','net', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;
  categories$: Observable<CategoryLookup[]>;
  items$: Observable<ItemLookup[]> = EMPTY;
  public invoiceItems: InvoiceDetail[] = [];
  private netAmount: number = 0;
  private totalPrice: number = 0;
  invoiceTotalAmount: number = 0;
  invoiceTotalDiscount: number = 0;
  private active: boolean = true;
  ngAfterViewInit() {
  }

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) private data: any,
                private itemsService: ItemsService,
                private invoiceService: InvoiceService,
                private categoryService: CategoryService,
                private toastr: ToastrService,
                public dialogRef: MatDialogRef<InvoiceModalComponent>) {
    this.paginator = <MatPaginator>{};
    this.table = <MatTable<any>>{};
    this.invoiceForm = new FormGroup({
      customerName: new FormControl(data?.invoice?.customerName, Validators.required),
      description: new FormControl(data?.invoice?.description, Validators.required),
      category: new FormControl(data?.category, Validators.required),
      issuedOn: new FormControl(data?.invoice?.invoiceDate, Validators.required),
      itemName: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      discount: new FormControl(),
      price: new FormControl({value: '', disabled:true}, Validators.required),
      invoiceDetails: new FormArray([])
    });
    this.categories$ = <Observable<CategoryLookup[]>>data.categories;

  }

  ngOnInit(): void {
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
  save() {
    let invoiceHeader: Invoice = <Invoice>{};
    let invoiceDetails: InvoiceDetail[] =[];
    invoiceHeader.invoiceDate = new Date(this.issuedOn.value);
    invoiceHeader.customerName = this.customerName.value;
    invoiceHeader.netAmount = this.netAmount;
    invoiceHeader.notes = this.description.value;
    invoiceHeader.categoryId = this.category.value.id;
    this.invoiceDetailsControlsList.forEach(a => {
      invoiceDetails.push({
        productId: a.get('itemId')?.value,
        price: a.get('price')?.value,
        qty: a.get('quantity')?.value,
        discount: a.get('discount')?.value,
        netAmount: a.get('netAmount')?.value,
        name:a.get('itemName')?.value,
        quantity: a.get('quantity')?.value
      }); console.log("ITem id: " + a.get('itemId')?.value)
      invoiceHeader.netAmount += +a.get('netAmount')?.value;
    });
    invoiceHeader.invoiceDetails = invoiceDetails;
    console.log(JSON.stringify(invoiceHeader))
    this.invoiceService.addInvoice(invoiceHeader)
      .pipe(takeWhile(()=>this.active))
      .subscribe(ret => {
          this.toastr.success('Invoice Creation successfully ', 'Created')
          this.dialogRef.close();
        },
        err => {
          this.toastr.error('Invoice Creation failed ', 'Create failed')
        });
  }

  close() {

  }
  editItem(row: number) {}

  deleteItem(id: number) {

  }

  calculateNet(item: InvoiceDetail): number {
    // @ts-ignore
    let i = item.price * item.quantity - (item.discount * item.quantity * item.price / 100);
    return i;
  }
  displayName(categoryLookup:CategoryLookup): string {
    return categoryLookup !== null ? categoryLookup.name : '';
  }

  addItem() {
    try {
      let item = <InvoiceDetail>{};
      item.id = this.itemName.value.id;
      item.name = this.itemName.value.name;
      item.price = +this.price.value;
      item.quantity = +this.quantity.value;
      item.discount = +this.discount.value;
      item.netAmount =this.calculateNet(item);
      this.invoiceDetails.controls.push(this.createGroup(item));
      this.invoiceItems.push(item);
      this.invoiceTotalAmount += item.netAmount;
      this.invoiceTotalDiscount += item.discount;
      this.itemName.reset();
      this.price.reset();
      this.discount.reset();
      this.quantity.reset();

    }catch (e){

    }
    }
  createGroup(item: InvoiceDetail){
    return new FormGroup({
      itemId: new FormControl(item.id),
      itemName: new FormControl(item.name, Validators.required),
      quantity: new FormControl(item.quantity, Validators.required),
      discount: new FormControl(item.discount),
      price: new FormControl({value: item.price, disabled:true}, Validators.required),
      netAmount: new FormControl({value: this.calculateNet(item), disabled: true})
    })
  }
  updateItemAutocomplete() {
    console.log(this.category.value.id);
    (typeof this.category.value.id !== 'undefined' ) && (this.items$ = this.categoryService.getItems(this.category.value.id));
  }

  fetchPrice() {
    if(this.itemName.value !== null)
      this.itemsService.getItemById(this.itemName.value.id).subscribe(d => {
      this.price.setValue(d.price);
    })
  }

  removeItem(id: number) {
    this.invoiceItems.splice(id,1);
    let netAmount = +this.invoiceDetailsControlsList[id]?.get('netAmount')?.value;
    (this.invoiceTotalAmount  > 0) && (this.invoiceTotalAmount -= netAmount);
    let totalDiscount = +this.invoiceDetailsControlsList[id]?.get('discount')?.value;
    (this.invoiceTotalDiscount > 0) && (this.invoiceTotalDiscount -= totalDiscount);
    this.invoiceDetails.controls.splice(id, 1);

  }

  ngOnDestroy(): void {
    this.active = false;
  }

  calculateItemTotal(id: number) {
    const item = this.invoiceItems[id];
    const qty: number = item.quantity || 0;
    const price: number = item.price;
    return qty * price;
  }
}
