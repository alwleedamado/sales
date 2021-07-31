import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Item} from "../services/item.model";
import {ItemService} from "../services/item.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ItemsModalComponent} from "../items-modal/items-modal.component";

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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(ItemsModalComponent, dialogConfig);
  }

  deleteItem(id: number) {

  }

  editItem(id:number) {

  }
}
