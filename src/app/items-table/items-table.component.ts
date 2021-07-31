import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Item} from "../services/item.model";
import {ItemService} from "../services/item.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ItemsModalComponent} from "../items-modal/items-modal.component";
import {CategoryModalComponent} from "../category-modal/category-modal.component";
import {openDialog} from "../dialog.utils";

@Component({
  selector: 'app-items-table',
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.scss']
})
export class ItemsTableComponent implements OnInit {
  items: Item[] = [];
  displayedColumns: string[] = ['name', 'description', 'price'];
  dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>(this.items);
  constructor(private itemService: ItemService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openItemsDialog() {
   openDialog(this.dialog, ItemsModalComponent,{});
  }

  deleteItem(id: number) {

  }

  editItem(id:number) {

  }
}
