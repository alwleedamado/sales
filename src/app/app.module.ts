import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CategoriesModule} from "./categories/categories.module";
import {ToastrModule} from "ngx-toastr";
import {ItemsModule} from "./items/items.module";
import {InvoiceModule} from "./invoices/invoice.module";
import {MatNativeDateModule} from "@angular/material/core";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CategoriesModule,
    ItemsModule,
    InvoiceModule,
    MatNativeDateModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
