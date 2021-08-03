import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Invoice} from "../services/invoice.model";
import {InvoiceService} from "../services/invoice.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {InvoiceModalComponent} from "../invoice-modal/invoice-modal.component";
import {ToastrService} from "ngx-toastr";
import {map, takeWhile} from "rxjs/operators";
import {Category, CategoryLookup} from "../services/category.model";
import {MatPaginator} from "@angular/material/paginator";
import {openDialog} from "../dialog.utils";
import {EMPTY, Observable} from "rxjs";
import {CategoryService} from "../services/category.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent implements OnInit, OnDestroy {
  invoices: Invoice[] = [];
  displayedColumns: string[] = ['id', 'invoiceDate','customerName', 'netAmount','show', 'edit', 'delete'];
  dataSource: MatTableDataSource<Invoice> = new MatTableDataSource<Invoice>(this.invoices);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private active: boolean = true;
  private categories$: Observable<CategoryLookup[]> = EMPTY;
  constructor(private invoiceService: InvoiceService,
              private categoryService: CategoryService,
              private toastr: ToastrService,
              private router: Router,
              private dialog: MatDialog) {
    this.paginator = <MatPaginator>{};
    this.categories$ = this.categoryService.getAllCategories().pipe(
      map<Category[], CategoryLookup[]>(cat =>
        cat.map<CategoryLookup>(c => {
          return <CategoryLookup>{id: c.id, name: c.name};
        })))
  }

  ngOnInit(): void {
    this.invoiceService.getAllInvoices().subscribe(data => {
        this.invoices = data;
        this.dataSource = new MatTableDataSource<Invoice>(this.invoices);
        this.dataSource.paginator = this.paginator;
      },
      err =>{
        console.error(err);
      })
  }

  openInvoiceDialog(data?: any) {
  openDialog(this.dialog,InvoiceModalComponent,data);
  }

  createInvoice() {
    let data = {categories: this.categories$};
    this.openInvoiceDialog(data);
  }

  deleteInvoice(id: number) {
    this.invoiceService.deleteInvoice(id)
      .pipe(
        takeWhile(() => this.active)
      )
      .subscribe(data =>{
          this.toastr.success('Invoice deleted successfully ', 'Deletion', {timeOut: 1000});
          setTimeout(() =>window.location.href = '/invoices', 1700);
          ;
        },
        err => {
          this.toastr.error('Invoice deletion failed ', 'Deletion failed', {timeOut: 1000});
          setTimeout(() =>window.location.href = '/invoices', 1700);
        });
  }

  editInvoice(id:number) {
    let invoice = this.invoices.find(m => m.id == id);
    let category;
    this.categories$
      .subscribe(s => {
        category = s.find(c => c.id == invoice?.categoryId);
        let data = {invoice,category, categories: this.categories$, formType: 'update'};console.log(invoice);
        this.openInvoiceDialog(data);
      })
  }
  ngOnDestroy() {
    this.active = false;
  }

  showDetails(id: number) {
    this.router.navigate(['/invoices', id]);
  }
}
