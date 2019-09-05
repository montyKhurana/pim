import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ProductCreateComponent} from "../product/product-create/product-create.component";
import {ProductListComponent} from "../product/product-list/product-list.component";

const routes: Routes = [
  {
    path: 'product-detail', // not implemented yet
    component: ProductListComponent,
  },
  {
    path: 'product-list',
    component: ProductListComponent,
  },
  {
    path: 'product-create',
    component: ProductCreateComponent
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class RoutingModule { }
