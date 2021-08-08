import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MatTableDataSource} from "@angular/material/table";
import {Category} from "../services/category.model";
import {MatDialog} from "@angular/material/dialog";
import {CategoryModalComponent} from "../category-modal/category-modal.component";
import {CategoryService} from "../services/category.service";
import {openDialog} from "../dialog.utils";
import {AppState} from "../state/app.state";
import {select, Store} from "@ngrx/store";
import {selectAllCategories, selectRemoveStatus} from "../state/selectors/categories.selectors";
import {filter, skip, take, takeWhile} from "rxjs/operators";
import {LoadCategories, RemoveCategory} from "../state/actions/categories.actions";
import {DialogStatus} from "../enums/dialog-status.enum";
import {FormType} from "../enums/formType";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss']
})
export class CategoriesTableComponent implements OnInit,AfterViewInit, OnDestroy {
  private categories: Category[] = [];
  public isLoading = true;
  dataSource: MatTableDataSource<Category> = new MatTableDataSource<Category>(this.categories);
  displayedColumns = ['name', 'description', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private componentActive: boolean = true;

  @ViewChild(MatSort) sort: MatSort;
  constructor(private toastr: ToastrService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              private store: Store<AppState>,
              private categoryService: CategoryService) {
    this.paginator = <MatPaginator>{};
    this.sort = <MatSort>{};
    this.dataSource = new MatTableDataSource<Category>(this.categories);
    this.store.dispatch(LoadCategories())
    this.dataSource = new MatTableDataSource<Category>([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openCategoryDialog(data?: any) {
    openDialog(this.dialog, CategoryModalComponent, data).afterClosed()
      .subscribe(ret => {
        if (ret) {
          if (ret === DialogStatus.updateSuccess) {
            this.toastr.success('Category Updated successfully ', 'Update', {timeOut: 1700});
          }
          else if (ret === DialogStatus.createSuccess) {
            this.toastr.success('Category Created successfully ', 'Create', {timeOut: 1700});
          }          else if (ret === DialogStatus.updateFailed) {
            this.toastr.error('Category Updated Failed ', 'Update', {timeOut: 1700});
          }          else if (ret === DialogStatus.createFailed) {
            this.toastr.error('Category Created Failed ', 'Create', {timeOut: 1700});
          }        }
        this.ngOnInit();
      });
  }

  editCategory(id: number) {
    let category = this.categories.find(m => m.id == id);
    let data = {category, formType: FormType.Edit}
    this.openCategoryDialog(data);
  }
count = 0;
  ngOnInit(): void {


    this.store.select(selectAllCategories)
      .subscribe(categories => {
        console.log(this.count++)
        this.categories = categories;
        this.dataSource.data =  [...categories];
        this.isLoading = false;
      });
  }

  deleteCategory(id: number) {
    let result = confirm("Confirm the deletion operation");
    if (result) {
      this.store.dispatch(RemoveCategory({categoryId: id}));
      this.store.select(selectRemoveStatus).pipe(filter(cat => cat.id == id))
        .subscribe(data => {
          if (data.deleted) {
            this.toastr.success('Category deleted successfully ', 'Deletion', {timeOut: 1700});
          } else {
            this.toastr.error('Category deletion failed ', 'Deletion', {timeOut: 1700});
          }
        });
    }
  }
  ngOnDestroy(): void {
    this.componentActive = false;
  }

  applyFilter($event: KeyboardEvent) {
    // @ts-ignore
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
