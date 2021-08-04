import {AfterViewInit, Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {CategoryLookup} from "../services/category.model";
import {MatPaginator} from "@angular/material/paginator";
import {Product, ProductLookup} from "../services/product.model";
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
export class InvoiceModalComponent implements OnInit, AfterViewInit, OnDestroy {
  invoiceForm: FormGroup;
  tableProducts: InvoiceDetail[] = [];
  // invoiceDetails: Product[] = [];

  dataSource: MatTableDataSource<InvoiceDetail> = new MatTableDataSource<InvoiceDetail>(this.tableProducts);
  displayedColumns = ['name', 'price', 'quantity', 'discount', 'net', 'edit', 'delete'];
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
  private currentInvoice: Invoice = <Invoice>{};
  private readonly formType: string = 'create';

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
      issuedOn: new FormControl(data?.invoice?.invoiceDate || new Date(), Validators.required),
      productName: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      discount: new FormControl(),
      price: new FormControl({value: '', disabled: true}, Validators.required),
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

  get productName() {
    return this.invoiceForm.get('productName') as FormControl;
  }

  get discount() {
    return this.invoiceForm.get('discount') as FormControl;
  }

  get invoiceDetails() {
    return this.invoiceForm.get('invoiceDetails') as FormArray;
  }

  get invoiceDetailsControlsList() {
    return this.invoiceDetails.controls as FormGroup[];
  }

  save() {
    console.log(this.invoiceForm.valid)
    let invoiceHeader: Invoice = <Invoice>{};
    let invoiceDetails: InvoiceDetail[] = [];
    invoiceHeader.invoiceDate = new Date(this.issuedOn.value);
    invoiceHeader.customerName = this.customerName.value;
    invoiceHeader.netAmount = this.netAmount;
    invoiceHeader.notes = this.description.value;
    invoiceHeader.categoryId = this.category.value.id;
    this.invoiceDetailsControlsList.forEach(a => {
      let invoiceDetail = <InvoiceDetail>{
        productId: a.get('productId')?.value,
        price: a.get('price')?.value,
        qty: a.get('quantity')?.value,
        discount: a.get('discount')?.value,
        netAmount: a.get('netAmount')?.value,
        name: a.get('productName')?.value,
        invoiceId: this.currentInvoice?.id || 0,
      };
      if (this.formType == 'update')
        invoiceDetail.id = a.get('id')?.value;
      invoiceDetails.push(invoiceDetail);
      invoiceHeader.netAmount += +a.get('netAmount')?.value;
    });
    invoiceHeader.invoiceDetails = invoiceDetails;
    if (this.formType === 'create') {
      this.invoiceService.addInvoice(invoiceHeader)
        .pipe(takeWhile(() => this.active))
        .subscribe(ret => {
            this.toastr.success('Invoice Creation successfully ', 'Created')
            this.dialogRef.close();
          },
          err => {
            this.toastr.error('Invoice Creation failed ', 'Create failed')
          });
    } else if (this.formType === 'update') {
      invoiceHeader.id = this.currentInvoice.id;
      console.log(JSON.stringify(invoiceHeader))

      this.invoiceService.updateInvoice(invoiceHeader.id, invoiceHeader)
        .pipe(takeWhile(() => this.active))
        .subscribe(ret => {
            this.toastr.success('Invoice updated successfully ', 'Update')
            this.dialogRef.close();
          },
          err => {
            this.toastr.error('Invoice Update failed ', 'Update failed')
          });
    }
  }


  close() {

  }
  loadData() {
    if (this.formType === 'update') {
      console.log(this.currentInvoice)
      this.category.setValue(this.currentInvoice.category);
      this.issuedOn.setValue(this.currentInvoice.invoiceDate);
      this.customerName.setValue(this.currentInvoice.customerName);
      this.currentInvoice.invoiceDetails.forEach(a => {
        this.invoiceDetailsControlsList.push(this.createGroup(a))
        this.invoiceTotalAmount += a.netAmount;
        this.invoiceTotalDiscount += a.discount;
        this.invoiceProducts.push(a);
      });
      console.log(this.currentInvoice);
      this.updateProductAutocomplete()
    }
  }

  calculateNet(Product: InvoiceDetail): number {
    let i = Product.price * Product.qty - (Product.discount * Product.qty * Product.price / 100);
    return i;
  }

  displayName(categoryLookup: CategoryLookup): string {
    return categoryLookup !== null ? categoryLookup.name : '';
  }

  addProduct() {
    try {
      let invoiceDetail = <InvoiceDetail>{};
      //invoiceDetail.id = this.currentInvoice.id || 0;
      invoiceDetail.productId = this.productName.value.id;
      if(invoiceDetail.product === undefined)
        invoiceDetail.product = <Product>{};
      (invoiceDetail.product.name = this.productName.value.name);
      invoiceDetail.price = +this.price.value;
      invoiceDetail.qty = +this.quantity.value;
      invoiceDetail.discount = +this.discount.value;
      invoiceDetail.netAmount = this.calculateNet(invoiceDetail);
      this.invoiceDetails.controls.push(this.createGroup(invoiceDetail));
      this.invoiceProducts.push(invoiceDetail);
      this.invoiceTotalAmount += invoiceDetail.netAmount;
      this.invoiceTotalDiscount += invoiceDetail.discount;
      console.log(invoiceDetail)
      this.productName.reset();
      this.price.reset();
      this.discount.reset();
      this.quantity.reset();
      this.invoiceForm.updateValueAndValidity();

    } catch (e) {
      console.error(e)
    }
  }

  createGroup(product: InvoiceDetail) {
    return new FormGroup({
      id: new FormControl(product.id),
      productId: new FormControl(product.productId),
      productName: new FormControl({value: product?.product?.name,disabled: true}, Validators.required),
      quantity: new FormControl(product.qty, Validators.required),
      discount: new FormControl(product.discount),
      price: new FormControl({value: product.price, disabled: true}, Validators.required),
      netAmount: new FormControl({value: product.netAmount, disabled: true})
    })
  }

  updateProductAutocomplete() {
    console.log(this.category.value.id);
    (typeof this.category.value.id !== 'undefined') && (this.Products$ = this.categoryService.getProducts(this.category.value.id));
  }

  fetchPrice() {
    if (this.productName.value !== null)
      this.ProductsService.getProductById(this.productName.value.id).subscribe(d => {
        this.price.setValue(d.price);
      })
  }

  removeProduct(id: number) {
    this.invoiceProducts.splice(id, 1);
    let netAmount = +this.invoiceDetailsControlsList[id]?.get('netAmount')?.value;
    (this.invoiceTotalAmount > 0) && (this.invoiceTotalAmount -= netAmount);
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
    this.invoiceProducts.find(p => p.productId == rowId);
    this.invoiceProducts[rowId].totalPrice = this.invoiceProducts[rowId].price * quantityField?.value;
    this.invoiceProducts[rowId].qty = quantityField?.value;console.log(this.invoiceProducts[rowId]);
    this.recalculateNet(this.invoiceProducts[rowId], rowId)
    this.recalculateTotalTotal();
    this.recalculateTotalDiscount();
  }

  recalculateNet(invoiceDetail: InvoiceDetail, index: number) {
    invoiceDetail.discount = +this.invoiceDetailsControlsList[index].get('discount')?.value;
    let newNet = this.calculateNet(invoiceDetail);
    invoiceDetail.netAmount = newNet;
    this.invoiceDetailsControlsList[index].get('netAmount')?.setValue(newNet);console.log(invoiceDetail)
    this.recalculateTotalDiscount();
   this.recalculateTotalTotal()
  }

  private recalculateTotalDiscount() {
    this.invoiceTotalDiscount = this.invoiceProducts.map(i => i.discount).reduce((a, b) => a + b);
  }
  private recalculateTotalTotal() {
    this.invoiceTotalAmount = this.invoiceProducts.map(i => i.netAmount).reduce((a, b) => a + b);
  }
}
