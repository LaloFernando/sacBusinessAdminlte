import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductosComponent } from './productos.component';
import { ProductComponent } from './product/product.component';
import { ListaraComponent } from './listara/listara.component';

@NgModule({
  declarations: [
    ProductosComponent,
    ProductComponent,
    ListaraComponent
  ],
  exports: [
    ProductosComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    SharedModule,
    RouterModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule
  ]

})
export class ProductosModule { }
