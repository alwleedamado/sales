import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Category} from "../services/category.model";
import {CategoryService} from "../services/category.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss']
})
export class CategoryModalComponent implements OnInit {
  categoryForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<CategoryModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryService: CategoryService,
    private toastr: ToastrService) {
    this.categoryForm = new FormGroup({
      name: new FormControl(data?.name, Validators.required),
      description: new FormControl(data?.description, Validators.required)
    });

    console.log(data);
  }
  get name() {
    return  this.categoryForm.get('name') as FormControl;
  }
  get description() {
    return  this.categoryForm.get('description') as FormControl;
  }
  save() {
    let category = this.categoryForm.value;
    if(this.data.formType == 'update') {
      category.id = this.data?.id;
      this.categoryService.updateCategory(this.data?.id, category)
        .subscribe(ret => {
          this.toastr.success('Category updated successfully ', 'Update')
          this.dialogRef.close();
        },
        err => {
          this.toastr.error('Category Update failed ', 'Update failed')
        });
    }else {
      let category = this.categoryForm.value;
      this.categoryService.addCategory(category)
        .subscribe(ret => {
            this.toastr.success('Category Created successfully ', 'Creation')
            this.dialogRef.close();
          },
          err => {
            this.toastr.error('Category Creation failed ', 'Creation failed')
          });
    }
  }
  close() {
    if(this.categoryForm.dirty || this.categoryForm.touched) {
      this.toastr.show('You will lose all you changes ', 'Unsaved changes');
    }
  }
  ngOnInit(): void {

  }

}
