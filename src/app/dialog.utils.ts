import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {CategoryModalComponent} from "./category-modal/category-modal.component";
import {Component} from "@angular/core";
import {ComponentType} from "@angular/cdk/overlay";
import {FormType} from "./enums/formType";

export function openDialog(dialog: MatDialog,dialogComponent: ComponentType<any>, data: any) : MatDialogRef<any>{
  let dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = true;
  if(typeof data !== 'undefined') {
    dialogConfig.data = data;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    return dialog.open(dialogComponent, dialogConfig);
  }else {
    dialogConfig.data = {formType: FormType.Create};
    return dialog.open(dialogComponent, dialogConfig);
  }
}
