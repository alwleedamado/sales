import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MatTableDataSource} from "@angular/material/table";
import {Category} from "../services/category.model";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {CategoryModalComponent} from "../category-modal/category-modal.component";
import {CategoryMockService} from "../services/category.mock.service";
import {CategoryService} from "../services/category.service";
import {ScrollStrategyOptions} from "@angular/cdk/overlay";
import {openDialog} from "../dialog.utils";
import {AppState} from "../state/app.state";
import {select, Store} from "@ngrx/store";
import {selectAllCategories} from "../state/selectors/categories.selectors";
import {takeWhile} from "rxjs/operators";
import {LoadCategories} from "../state/actions/categories.actions";

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss']
})
export class CategoriesTableComponent implements OnInit,AfterViewInit, OnDestroy {
  private categories: Category[] = [];
  dataSource: MatTableDataSource<Category> = new MatTableDataSource<Category>(this.categories);
  displayedColumns=['name', 'description', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private componentActive: boolean = true;
  constructor(  private toastr: ToastrService,
                private router:Router,
                private activatedRoute: ActivatedRoute,
                private dialog: MatDialog,
                private categoryService: CategoryService,
                private store: Store<AppState>) {
    this.paginator = <MatPaginator>{};
    store.dispatch(LoadCategories());
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openCategoryDialog(data?: any) {
    openDialog(this.dialog, CategoryModalComponent, data);
  }
  editCategory(id: number) {
    let category = this.categories.find(m => m.id == id);
    this.openCategoryDialog(category);
  }
  ngOnInit(): void {

    this.store.pipe(
      /*takeWhile(() => this.componentActive),*/
      select(selectAllCategories))
      .subscribe(categories => {
        this.categories = categories;
        this.dataSource = new MatTableDataSource<Category>(this.categories);
        this.dataSource.paginator = this.paginator;debugger;
      });


 /*   this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data;
      this.dataSource = new MatTableDataSource<Category>(this.categories);
      this.dataSource.paginator = this.paginator;
    },
      err =>{
      console.error(err);
      })*/
  }


  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id)
      .subscribe(data =>{
        this.toastr.success('Category deleted successfully ', 'Deletion', {timeOut: 300});
      setTimeout(() =>window.location.href = '/categories', 700);
       ;
        },
        err => {
          this.toastr.error('Category deletion failed ', 'Cannot delete category that has products in it', {timeOut: 1500});
          setTimeout(() =>window.location.href = '/categories', 700);
        });
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }
}
