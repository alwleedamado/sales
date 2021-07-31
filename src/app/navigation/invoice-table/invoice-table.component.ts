import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Invoice} from "../../shared-services/invoice.model";
import {InvoiceService} from "../invoice.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {InvoiceModalComponent} from "../invoice-modal/invoice-modal.component";

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class invoiceTableComponent implements OnInit {
  invoices: Invoice[] = [];
  displayedColumns: string[] = ['name', 'description'];
  dataSource: MatTableDataSource<Invoice> = new MatTableDataSource<Invoice>(this.invoices);
  constructor(private invoiceService: InvoiceService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openInvoiceDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(InvoiceModalComponent, dialogConfig);
  }

  deleteInvoice(id: number) {

  }

  editInvoice(id:number) {

  }
}
