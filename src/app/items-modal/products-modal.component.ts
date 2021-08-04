import {Component, Inject, OnDestroy, OnInit, Optional} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {CategoryLookup} from "../services/category.model";
import {Product} from "../services/product.model";
import {ProductsService} from "../services/products.service";
import {ToastrService} from "ngx-toastr";
import {takeWhile} from "rxjs/operators";
import {FormType} from "../enums/formType";
import {DialogStatus} from "../enums/dialog-status.enum";

@Component({
  selector: 'app-items-modal',
  templateUrl: './products-modal.component.html',
  styleUrls: ['./products-modal.component.scss']
})
export class ProductsModalComponent implements OnInit, OnDestroy {
  itemForm: FormGroup;
  formType: FormType = FormType.Create;
  categories$: Observable<CategoryLookup[]>;
  private itemId: number;

  private invoiceProducts: Product[] = [];
  private active: boolean = true;
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) private data: any,
              private itemsService: ProductsService,
              private toastr: ToastrService,
              public dialogRef: MatDialogRef<ProductsModalComponent>) {
    this.itemForm = new FormGroup({
      name: new FormControl(data?.product?.name, Validators.required),
      description: new FormControl(data?.product?.description, Validators.required),
      price: new FormControl(data.product?.price, [Validators.required, Validators.pattern('[0-9.]+')]),
      category: new FormControl(data?.category, Validators.required)
    })
    this.formType = data?.formType;
    (( data.formType === FormType.Edit) && (this.itemId = data?.product.id)) || (this.itemId = 0);
    this.categories$ = <Observable<CategoryLookup[]>>data.categories;
  }

  ngOnDestroy(): void {
        this.active = false;
    }

  ngOnInit(): void {
  }
  get name() {
    return this.itemForm.get('name') as FormControl;
  }
  get description() {
    return this.itemForm.get('description') as FormControl;
  }
  get price() {
    return this.itemForm.get('price') as FormControl;
  }
get category() {
    return this.itemForm.get('category') as FormControl;
}
  save() {
    let item = <Product>{};
    item.name = this.name.value;
    item.price = this.price.value;
    item.categoryId = this.category.value.id;
    if(this.formType === FormType.Create){
      this.itemsService.addProduct(item)
        .pipe(takeWhile(() => this.active))
        .subscribe(ret => {
      this.dialogRef.close(DialogStatus.createSuccess);
        },
          error => {
            this.dialogRef.close(DialogStatus.createFailed);
          });
    }else if(this.formType === FormType.Edit){
      item.id = this.itemId;
      this.itemsService.updateProduct(item.id, item)
        .pipe(takeWhile(() => this.active))
        .subscribe(
        d => {
          this.dialogRef.close(DialogStatus.updateSuccess);
        },
          error => {
            this.dialogRef.close(DialogStatus.updateFailed);
          });
    }
  }

  close() {}

  displayName(categoryLookup:CategoryLookup): string {
    return categoryLookup !== null ? categoryLookup.name : '';
  }
}
