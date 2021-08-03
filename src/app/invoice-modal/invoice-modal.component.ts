import {AfterViewInit, Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {CategoryLookup} from "../services/category.model";
import {MatPaginator} from "@angular/material/paginator";
import {ProductLookup} from "../services/product.model";
import {EMPTY, Observable} from "rxjs";
import {ProductsService} from "../services/products.service";
import {ToastrService} from "ngx-toastr";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CategoryService} from "../services/category.service";
import {Invoice, InvoiceDetail} from "../services/invoice.model";
import {InvoiceService} from "../services/invoice.service";
import {takeWhile} from "rxjs/operators";

@Component({
  selector: 'app-Products-modal',
  templateUrl: './invoice-modal.component.html',
  styleUrls: ['./invoice-modal.component.scss'],

})
export class InvoiceModalComponent implements OnInit,AfterViewInit,OnDestroy {
  invoiceForm: FormGroup;
  tableProducts: InvoiceDetail[] = [];
 // invoiceDetails: Product[] = [];

  dataSource: MatTableDataSource<InvoiceDetail> = new MatTableDataSource<InvoiceDetail>(this.tableProducts);
  displayedColumns=['name','price','quantity','discount','net', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;
  categories$: Observable<CategoryLookup[]>;
  Products$: Observable<ProductLookup[]> = EMPTY;
  public invoiceProducts: InvoiceDetail[] = [];
  private netAmount: number = 0;
  private totalPrice: number = 0;
  invoiceTotalAmount: number = 0;
  invoiceTotalDiscount: number = 0;
  private active: boolean = true;
  private currentInvoice: Invoice =  <Invoice>{};
  private formType: string = 'create';
  ngAfterViewInit() {
  }

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) private data: any,
                private ProductsService: ProductsService,
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
      ProductName: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      discount: new FormControl(),
      price: new FormControl({value: '', disabled:true}, Validators.required),
      invoiceDetails: new FormArray([])
    });
    this.categories$ = <Observable<CategoryLookup[]>>data.categories;
    this.currentInvoice = data.invoice;
    (typeof data.formType !== 'undefined') && (this.formType = data.formType);
  }

  ngOnInit(): void {
    this.loadData();

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
patchValue(entity: any, newEntity: any) : any {
    let keys = Object.keys(entity);
    for(let key of keys) {
      (newEntity[key] !== null) && (entity[key] = newEntity[key]);
    }
    return entity;
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
        productId: a.get('ProductId')?.value,
        price: a.get('price')?.value,
        qty: a.get('quantity')?.value,
        discount: a.get('discount')?.value,
        netAmount: a.get('netAmount')?.value,
        name:a.get('ProductName')?.value,
        invoiceId: this.currentInvoice.id,
        id: a.get('id')?.value
      });
      invoiceHeader.netAmount += +a.get('netAmount')?.value;
    });
    invoiceHeader.invoiceDetails = invoiceDetails;
    if(this.formType === 'create') {
      console.log(JSON.stringify(invoiceHeader))
      this.invoiceService.addInvoice(invoiceHeader)
        .pipe(takeWhile(() => this.active))
        .subscribe(ret => {
            this.toastr.success('Invoice Creation successfully ', 'Created')
            this.dialogRef.close();
          },
          err => {
            this.toastr.error('Invoice Creation failed ', 'Create failed')
          });
    }else if(this.formType === 'update') {
     this.currentInvoice =  this.patchValue(this.currentInvoice, invoiceHeader);
      invoiceHeader.id = this.currentInvoice.id;
      console.log(JSON.stringify(this.currentInvoice))

      /*      this.invoiceService.updateInvoice(invoiceHeader.id, invoiceHeader)
              .pipe(takeWhile(() => this.active))
              .subscribe(ret => {
                  this.toastr.success('Invoice updated successfully ', 'Update')
                  this.dialogRef.close();
                },
                err => {
                  this.toastr.error('Invoice Update failed ', 'Update failed')
                });*/
    }
  }

  close() {

  }
  editProduct(row: number) {}

  deleteProduct(id: number) {

  }
  loadData() {
        this.category.setValue(this.currentInvoice.category);
        this.issuedOn.setValue(this.currentInvoice.invoiceDate);
        this.customerName.setValue(this.currentInvoice.customerName);
        this.currentInvoice.invoiceDetails.forEach(a => {
          this.invoiceDetailsControlsList.push(this.createGroup(a))
          this.invoiceTotalAmount += a.netAmount;
          this.invoiceTotalDiscount += a.discount;
          console.log(a.invoiceId);
          this.invoiceProducts.push(a);
          console.log(`InvoiceID: ${a.invoiceId}`)
        });
      this.updateProductAutocomplete()
  }

  calculateNet(Product: InvoiceDetail): number {console.log(`Product: ${JSON.stringify(Product)}`)
    // @ts-ignore
    let i = Product.price * Product.qty - (Product.discount * Product.qty * Product.price / 100);
    return i;
  }
  displayName(categoryLookup:CategoryLookup): string {
    return categoryLookup !== null ? categoryLookup.name : '';
  }

  addProduct() {
    try {
      let Product = <InvoiceDetail>{};
      Product.id = this.ProductName.value.id;
      Product.name = this.ProductName.value.name;
      Product.price = +this.price.value;
      Product.qty = +this.quantity.value;
      Product.discount = +this.discount.value;
      Product.netAmount = this.calculateNet(Product);
      this.invoiceDetails.controls.push(this.createGroup(Product));
      this.invoiceProducts.push(Product);
      this.invoiceTotalAmount += Product.netAmount;
      this.invoiceTotalDiscount += Product.discount;
      if(this.formType === 'update')
        Product.invoiceId = this.currentInvoice.id;
      this.ProductName.reset();
      this.price.reset();
      this.discount.reset();
      this.quantity.reset();

    }catch (e){

    }
    }
  createGroup(Product: InvoiceDetail){
    return new FormGroup({
      id: new FormControl({value: Product.id, hidden:true}),
      ProductId: new FormControl(Product.id),
      ProductName: new FormControl(Product.name, Validators.required),
      quantity: new FormControl(Product.qty, Validators.required),
      discount: new FormControl(Product.discount),
      price: new FormControl({value: Product.price, disabled:true}, Validators.required),
      netAmount: new FormControl({value: this.calculateNet(Product), disabled: true})
    })
  }
  updateProductAutocomplete() {
    console.log(this.category.value.id);
    (typeof this.category.value.id !== 'undefined' ) && (this.Products$ = this.categoryService.getProducts(this.category.value.id));
  }

  fetchPrice() {
    if(this.ProductName.value !== null)
      this.ProductsService.getProductById(this.ProductName.value.id).subscribe(d => {
      this.price.setValue(d.price);
    })
  }

  removeProduct(id: number) {
    this.invoiceProducts.splice(id,1);
    let netAmount = +this.invoiceDetailsControlsList[id]?.get('netAmount')?.value;
    (this.invoiceTotalAmount  > 0) && (this.invoiceTotalAmount -= netAmount);
    let totalDiscount = +this.invoiceDetailsControlsList[id]?.get('discount')?.value;
    (this.invoiceTotalDiscount > 0) && (this.invoiceTotalDiscount -= totalDiscount);
    this.invoiceDetails.controls.splice(id, 1);

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

  quantityChanged(rowId: number) {
    const quantityField = this.invoiceDetailsControlsList[rowId].get('quantity');
    this.invoiceProducts[rowId].totalPrice = this.invoiceProducts[rowId].price * quantityField?.value;
  }
}
