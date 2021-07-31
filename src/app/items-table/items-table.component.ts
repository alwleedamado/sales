import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Item} from "../services/item.model";
import {ItemService} from "../services/item.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ItemsModalComponent} from "../items-modal/items-modal.component";
import {CategoryModalComponent} from "../category-modal/category-modal.component";
import {openDialog} from "../dialog.utils";
import {ItemsService} from "../services/items.service";
import {ToastrService} from "ngx-toastr";
import {MatPaginator} from "@angular/material/paginator";
import {Category} from "../services/category.model";

@Component({
  selector: 'app-items-table',
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.scss']
})
export class ItemsTableComponent implements OnInit {
  items: Item[] = [];
  displayedColumns: string[] = ['name', 'description', 'price'];
  dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>(this.items);
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private itemService: ItemsService,
              private toastr: ToastrService,
              private dialog: MatDialog) {
    this.paginator = <MatPaginator>{};
  }

  ngOnInit(): void {
    this.itemService.getAllItems().subscribe(data => {
        this.items = data;
        this.dataSource = new MatTableDataSource<Item>(this.items);
        this.dataSource.paginator = this.paginator;
      },
      err =>{
        console.error(err);
      })
  }

  openItemsDialog(data?: any) {
   openDialog(this.dialog, ItemsModalComponent,data);
  }

  deleteItem(id: number) {
    this.itemService.deleteItem(id)
      .subscribe(data =>{
          this.toastr.success('Item deleted successfully ', 'Deletion', {timeOut: 300})

        },
        err => this.toastr.error('Item deletion failed ', 'Deletion failed'));
  }

  editItem(id:number) {
    let item = this.items.find(m => m.id == id);
    this.openItemsDialog(item);
  }
}
