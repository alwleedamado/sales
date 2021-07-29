import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MatTableDataSource} from "@angular/material/table";
import {Category} from "../../shared-services/category.model";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {CategoryModalComponent} from "../category-modal/category-modal.component";

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss']
})
export class CategoriesTableComponent implements OnInit,AfterViewInit {
  private categories: Category[] = [];

  constructor(  private toastr: ToastrService,
                private router:Router,
                private activatedRoute: ActivatedRoute,
                private dialog: MatDialog) {
  this.paginator = <MatPaginator>{};
  }
  dataSource: MatTableDataSource<Category> = new MatTableDataSource<Category>(this.categories);
  displayedColumns=['name', 'description', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openCategoryDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(CategoryModalComponent, dialogConfig);
  }
  editCategory(id: number){

  }
  ngOnInit(): void {
  }


  deleteCategory(id: number) {

  }
}
