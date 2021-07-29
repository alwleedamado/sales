import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesTableComponent } from './categories-table/categories-table.component';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import { CategoryModalComponent } from './category-modal/category-modal.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    CategoriesTableComponent,
    CategoryModalComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    RouterModule.forChild([
      {path: 'categories', component: CategoriesTableComponent}
    ]),
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  entryComponents:[CategoryModalComponent],
  exports:[RouterModule]
})
export class CategoriesModule { }
