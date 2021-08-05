import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CategoryService} from "../services/category.service";
import {ToastrService} from "ngx-toastr";
import {DialogStatus} from "../enums/dialog-status.enum";
import {FormType} from "../enums/formType";

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss']
})
export class CategoryModalComponent implements OnInit {
  categoryForm: FormGroup;
  public isLoading = false;
  formType: FormType = FormType.Create;
  constructor(
    public dialogRef: MatDialogRef<CategoryModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryService: CategoryService,
    private toastr: ToastrService) {
    this.categoryForm = new FormGroup({
      name: new FormControl(data?.category?.name, Validators.required),
      description: new FormControl(data?.category?.description, Validators.required)
    });
    this.formType = data?.formType;
  }
  get name() {
    return  this.categoryForm.get('name') as FormControl;
  }
  get description() {
    return  this.categoryForm.get('description') as FormControl;
  }
  save() {
    if(this.categoryForm.valid) {
      this.isLoading = true;
      let category = this.categoryForm.value;
      if (this.data.formType == FormType.Edit) {
        category.id = this.data?.category?.id;
        this.categoryService.updateCategory(this.data?.category?.id, category)
          .subscribe(ret => {
            this.isLoading = false
              this.dialogRef.close(category.id);
            },
            err => {
              this.dialogRef.close(DialogStatus.updateFailed)
            });
      } else {
        let category = this.categoryForm.value;
        this.categoryService.addCategory(category)
          .subscribe(ret => {
              this.dialogRef.close(DialogStatus.createSuccess);
            },
            err => {
              this.dialogRef.close(DialogStatus.createFailed)
            });
      }
    }
  }
  close() {
    this.dialogRef.close();
  }
  ngOnInit(): void {

  }

}
