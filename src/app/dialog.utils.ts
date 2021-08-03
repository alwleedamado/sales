import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {CategoryModalComponent} from "./category-modal/category-modal.component";
import {Component} from "@angular/core";
import {ComponentType} from "@angular/cdk/overlay";

export function openDialog(dialog: MatDialog,dialogComponent: ComponentType<any>, data: any) : MatDialogRef<any>{
  let dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = true;
  if(typeof data !== 'undefined') {
    console.log(data);
    dialogConfig.data = data;
    dialogConfig.data.formType = data.formType || 'update';
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    return dialog.open(dialogComponent, dialogConfig);
  }else {
    dialogConfig.data = {formType: 'create'};
    return dialog.open(dialogComponent, dialogConfig);
  }
}
