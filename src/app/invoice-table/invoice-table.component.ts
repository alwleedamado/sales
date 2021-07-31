import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Invoice} from "../services/invoice.model";
import {InvoiceService} from "../services/invoice.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {InvoiceModalComponent} from "../invoice-modal/invoice-modal.component";

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent implements OnInit {
  invoices: Invoice[] = [];
  displayedColumns: string[] = ['id', 'issuedOn','customerName', 'totalPrice'];
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
