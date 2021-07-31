import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToastrModule} from "ngx-toastr";
import {MatNativeDateModule} from "@angular/material/core";
import {RouterModule} from "@angular/router";
import {CategoriesTableComponent} from "./categories-table/categories-table.component";
import {CategoryModalComponent} from "./category-modal/category-modal.component";
import {ItemsModalComponent} from "./items-modal/items-modal.component";
import {ItemsTableComponent} from "./items-table/items-table.component";
import {InvoiceModalComponent} from "./invoice-modal/invoice-modal.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {InvoiceTableComponent} from "./invoice-table/invoice-table.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatListModule} from "@angular/material/list";
import {MatSidenavModule} from "@angular/material/sidenav";
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {CategoryMockService} from "./services/category.mock.service";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    CategoriesTableComponent,
    CategoryModalComponent,
    ItemsModalComponent,
    ItemsTableComponent,
    InvoiceModalComponent,
    DashboardComponent,
    InvoiceTableComponent,
    NavComponent

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path:'categories', component: CategoriesTableComponent},
      {path:'items', component:ItemsTableComponent},
      {path:'invoices', component: InvoiceTableComponent}
    ]),
    BrowserAnimationsModule,
    MatNativeDateModule,
    ToastrModule.forRoot(),
    MatDatepickerModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatListModule,
    MatSidenavModule,
    LayoutModule,
    MatToolbarModule,
    MatIconModule,
    HttpClientModule,
  ],
  providers: [CategoryMockService],
  bootstrap: [AppComponent]
})
export class AppModule { }
