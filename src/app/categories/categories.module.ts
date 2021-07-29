import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesTableComponent } from './categories-table/categories-table.component';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";



@NgModule({
  declarations: [
    CategoriesTableComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    RouterModule.forChild([
      {path: 'categories', component: CategoriesTableComponent}
    ]),
    MatButtonModule
  ],
  exports:[RouterModule]
})
export class CategoriesModule { }
