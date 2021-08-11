import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CategoryService} from "../services/category.service";
import {ToastrService} from "ngx-toastr";
import {DialogStatus} from "../enums/dialog-status.enum";
import {FormType} from "../enums/formType";
import {
  AddCategory,
  ResetAddCategoryRequestState,
  ResetUpdateCategoryRequestState,
  UpdateCategory
} from "../state/actions/categories.actions";
import {select, Store} from "@ngrx/store";
import {AppState, httpState} from "../state/app.state";
import {takeWhile} from "rxjs/operators";
import { CategoriesSelector } from '../state/selectors/categories.selectors';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss']
})
export class CategoryModalComponent implements OnInit {
  categoryForm: FormGroup;
  public isLoading = false;
  formType: FormType = FormType.Create;
  private componentActive: boolean;

  constructor(
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<CategoryModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryService: CategoryService,
    private toastr: ToastrService) {
    this.categoryForm = new FormGroup({
      id: new FormControl(data?.category?.id ?? 0, Validators.required),
      name: new FormControl(data?.category?.name ?? '', Validators.required),
      description: new FormControl(data?.category?.description ?? '')
    });
    this.formType = data?.formType;
  }

  get name() {
    return this.categoryForm.get('name') as FormControl;
  }

  get description() {
    return this.categoryForm.get('description') as FormControl;
  }

  save() {
    if (this.categoryForm.valid) {
      let category = this.categoryForm.value;
      if (this.data.formType == FormType.Edit) {
        category.id = this.data?.category?.id;
        this.store.dispatch(UpdateCategory({entity: category}));
        this.store.pipe(select(CategoriesSelector.selectUpdateStatus))
          .subscribe(ret => {
            this.isLoading = false
            if (ret === httpState.success) {
              this.store.dispatch(ResetUpdateCategoryRequestState());
              this.dialogRef.close(DialogStatus.updateSuccess);
            } else if (ret === httpState.fail) {
              this.store.dispatch(ResetUpdateCategoryRequestState());
              this.dialogRef.close(DialogStatus.updateFailed)
            }
          });
      } else {
        let category = this.categoryForm.value;
        this.store.dispatch(AddCategory({entity: category}));
        this.store.pipe(select(CategoriesSelector.selectCreateRequestStatus))
          .subscribe((ret: any) => {
            if (ret == httpState.success) {
              this.store.dispatch(ResetAddCategoryRequestState());
              this.dialogRef.close(DialogStatus.createSuccess);
            } else if (ret === httpState.fail) {
              this.store.dispatch(ResetAddCategoryRequestState());
              this.dialogRef.close(DialogStatus.createFailed)
            }
          });
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.store.pipe(
      select(CategoriesSelector.selectAddLoadingStatus,CategoriesSelector.selectRemoveLoadingStatus),
      takeWhile(() => this.componentActive))
      .subscribe(status => this.isLoading = status  )
  }

}
