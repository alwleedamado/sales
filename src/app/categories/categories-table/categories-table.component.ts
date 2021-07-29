import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MatTableDataSource} from "@angular/material/table";
import {Category} from "../../shared-services/category.model";

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss']
})
export class CategoriesTableComponent implements OnInit,AfterViewInit {
  private categories: Category[] = [];

  constructor(  private toastr: ToastrService,
                private router:Router,
                private activatedRoute: ActivatedRoute) {
  this.paginator = <MatPaginator>{};
  }
  dataSource: MatTableDataSource<Category> = new MatTableDataSource<Category>(this.categories);
  displayedColumns=['name', 'description', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  editCategory(id: number){

  }
  ngOnInit(): void {
  }


  deleteCategory(id: number) {

  }
}
