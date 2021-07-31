import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {validateConstructorDependencies} from "@angular/compiler-cli/src/ngtsc/annotations/src/util";
import {MatTableDataSource} from "@angular/material/table";
import {Category} from "../../shared-services/category.model";
import {MatPaginator} from "@angular/material/paginator";
import {Item} from "../../shared-services/item.model";

@Component({
  selector: 'app-items-modal',
  templateUrl: './invoice-modal.component.html',
  styleUrls: ['./invoice-modal.component.scss']
})
export class InvoiceModalComponent implements OnInit,AfterViewInit {
  invoiceForm: FormGroup;
  items: Item[] = [];
  dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>(this.items);
  displayedColumns=['name', 'description','price','quantity','discount','net', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    this.paginator = <MatPaginator>{};
    this.invoiceForm = new FormGroup({
      customerName: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      issuedOn: new FormControl('', Validators.required),
      itemName: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      discount: new FormControl(),
      price: new FormControl({value: '', disabled:true}, Validators.required),
    });

  }

  ngOnInit(): void {
  }
  get customerName() {
    return this.invoiceForm.get('customerName') as FormControl;
  }
  get description() {
    return this.invoiceForm.get('description') as FormControl;
  }
  get price() {
    return this.invoiceForm.get('price') as FormControl;
  }
  get category() {
    return this.invoiceForm.get('category') as FormControl;
  }
get issuedOn() {
    return this.invoiceForm.get('issuedOn') as FormControl;
}

get quantity() {
    return this.invoiceForm.get('quantity') as FormControl;
}
get itemName() {
    return this.invoiceForm.get('itemName') as FormControl;
}

  save() {

  }

  close() {

  }
  editItem(row: number) {}

  deleteItem(id: number) {

  }

  calculateNet(id: number): number {
    return 0;
  }
}
