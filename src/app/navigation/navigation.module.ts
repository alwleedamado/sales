import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MatSidenavModule} from "@angular/material/sidenav";



@NgModule({
  declarations: [
    DashboardComponent
  ],
    imports: [
        CommonModule,
        MatSidenavModule
    ]
})
export class NavigationModule { }
