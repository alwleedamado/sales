import {Component, Inject, OnDestroy, OnInit, Optional} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CategoryService} from "../services/category.service";
import {Observable} from "rxjs";
import {Category, CategoryLookup} from "../services/category.model";
import {Item} from "../services/item.model";
import {ItemsService} from "../services/items.service";
import {ToastrService} from "ngx-toastr";
import {takeWhile} from "rxjs/operators";

@Component({
  selector: 'app-items-modal',
  templateUrl: './items-modal.component.html',
  styleUrls: ['./items-modal.component.scss']
})
export class ItemsModalComponent implements OnInit, OnDestroy {
  itemForm: FormGroup;
  formType: string = 'create';
  categories$: Observable<CategoryLookup[]>;
  private itemId: number;
  private invoiceItems: Item[] = [];
  private active: boolean = true;
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) private data: any,
              private itemsService: ItemsService,
              private toastr: ToastrService,
              public dialogRef: MatDialogRef<ItemsModalComponent>) {
    this.itemForm = new FormGroup({
      name: new FormControl(data?.item.name, Validators.required),
      description: new FormControl(data?.item.description, Validators.required),
      price: new FormControl(data.item.price, [Validators.required, Validators.pattern('[0-9]+\.{1}(?:[0-9\.]{2}){1}')]),
      category: new FormControl(data.category, Validators.required)
    })
    this.formType = 'update';
    this.itemId = data?.item.id;
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
    let item = <Item>{};
    item.name = this.name.value;
    item.price = this.price.value;
    item.categoryId = this.category.value.id;
    item.description = this.description.value;
    if(this.formType === 'create'){

      this.itemsService.addItem(item)
        .pipe(takeWhile(() => this.active))
        .subscribe(ret => {
      this.toastr.success('Item Created successfully ', 'Creation')
      this.dialogRef.close();
    },
          error => {
            this.toastr.success('Item creation failed ', 'updating')
            this.dialogRef.close();
          });
    }else if(this.formType === 'update'){
      item.id = this.itemId;
      this.itemsService.updateItem(item.id, item)
        .pipe(takeWhile(() => this.active))
        .subscribe(
        d => {
          this.toastr.success('Item updated successfully ', 'updating')
          this.dialogRef.close();
        },
          error => {
            this.toastr.success('Item updated failed ', 'updating')
            this.dialogRef.close();
          });
    }
  }

  close() {
    if(this.itemForm.dirty || this.itemForm.touched) {
      this.toastr.show('You will lose all you changes ', 'Unsaved changes');
      this.dialogRef.close();
    }  }

  displayName(categoryLookup:CategoryLookup): string {
    return categoryLookup !== null ? categoryLookup.name : '';
  }
}
