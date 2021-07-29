import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsTableComponent } from './items-table/items-table.component';
import { ItemsModalComponent } from './items-modal/items-modal.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatButtonModule} from "@angular/material/button";
import {MatSortModule} from "@angular/material/sort";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";



@NgModule({
  declarations: [
    ItemsTableComponent,
    ItemsModalComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    HttpClientModule,
    RouterModule.forChild([{
      path: 'items', component: ItemsTableComponent
    }]),
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule
  ],
  entryComponents:[ItemsModalComponent],
  exports:[]
})
export class ItemsModule { }
