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
import {ProductsModalComponent} from "./items-modal/products-modal.component";
import {ProductsTableComponent} from "./items-table/products-table.component";
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
import {HttpClientModule} from "@angular/common/http";
import {MatSortModule} from "@angular/material/sort";
import {CategoryService} from "./services/category.service";
import {ProductsService} from "./services/products.service";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {InvoiceFormComponent} from "./invoice-form/invoice-form.component";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {categoriesReducer, categoryReducer} from "./state/reducers/categoriesReducer";
import {productsReducer} from "./state/reducers/productsReducer";
import {invoicesReducer} from "./state/reducers/invoicesReducer";
import { EffectsModule } from '@ngrx/effects';
import { CategoriesEffects } from './state/effects/categories.effects';
import { ProductsEffects } from './state/effects/products.effects';
import { InvoicesEffects } from './state/effects/invoices.effects';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    AppComponent,
    CategoriesTableComponent,
    CategoryModalComponent,
    ProductsModalComponent,
    ProductsTableComponent,
    InvoiceModalComponent,
    DashboardComponent,
    InvoiceTableComponent,
    NavComponent,
    InvoiceFormComponent,

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'categories', component: CategoriesTableComponent},
      {path: 'items', component: ProductsTableComponent},
      {path: 'invoices', component: InvoiceTableComponent},
      {path:'invoices/:id',component:InvoiceFormComponent},
      {path:'**', redirectTo:'categories', pathMatch:'full'}
    ],{onSameUrlNavigation: 'reload'}),
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
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
    MatSortModule,
    StoreModule.forRoot({
      categories: categoryReducer,
      products: productsReducer,
      invoices: invoicesReducer
    }),
    StoreDevtoolsModule.instrument({
      name:"Invoice Management",
    }),
    EffectsModule.forRoot([CategoriesEffects, ProductsEffects, InvoicesEffects])
  ],
  providers: [CategoryService,ProductsService,    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
