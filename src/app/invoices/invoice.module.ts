import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { InvoiceModalComponent } from './invoice-modal/invoice-modal.component';
import { invoiceTableComponent } from './invoice-table/invoice-table.component';



@NgModule({
  declarations: [
    InvoiceModalComponent,
    invoiceTableComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    HttpClientModule,
    RouterModule.forChild([{
      path: 'invoices', component: invoiceTableComponent
    }]),
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule
  ],
  entryComponents:[InvoiceModalComponent],
  exports:[]
})
export class ItemsModule { }
