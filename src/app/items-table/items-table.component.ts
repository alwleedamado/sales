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
import {Category, CategoryLookup} from "../services/category.model";
import {CategoryService} from "../services/category.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-items-table',
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.scss']
})
export class ItemsTableComponent implements OnInit {
  items: Item[] = [];
  displayedColumns: string[] = ['name', 'description', 'price','edit', 'delete'];
  dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>(this.items);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private categories$: Observable<CategoryLookup[]>;


  constructor(private itemService: ItemsService,
              private toastr: ToastrService,
              private dialog: MatDialog,
              private categoryService: CategoryService) {
    this.paginator = <MatPaginator>{};
    this.categories$ = this.categoryService.getAllCategories().pipe(
      map<Category[], CategoryLookup[]>(cat =>
        cat.map<CategoryLookup>(c => {
          return <CategoryLookup>{id: c.id, name: c.name};
        }))
    );
  }

  ngOnInit(): void {
    this.itemService.getAllItems().subscribe(data => {
        this.items = data;
        this.dataSource = new MatTableDataSource<Item>(this.items);
        this.dataSource.paginator = this.paginator;
      },
      err =>{
        console.error(err);
      });

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
    let category : CategoryLookup | undefined;
    this.categories$
      .subscribe(s => {
        category = s.find(c => c.id == item?.categoryId);
        let data = {item,category, categories: this.categories$, formType: 'update'};console.log(category)
        this.openItemsDialog(data);
      })

  }

  addNewItem() {
    let data = {categories: this.categories$};
    this.openItemsDialog(data);
  }
}
