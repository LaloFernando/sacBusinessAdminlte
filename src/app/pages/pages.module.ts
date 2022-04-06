import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';

import { VentasComponent } from './ventas/ventas.component';
import { ProductosComponent } from './productos/productos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';

import { DataTablesModule } from "angular-datatables";
import { CambioPassComponent } from './usuarios/cambio-pass/cambio-pass.component';

@NgModule({
  declarations: [
    DashboardComponent,
    UsuariosComponent,
    ProductosComponent,
    VentasComponent,
    PagesComponent,
    CambioPassComponent
  ],
  exports: [
    DashboardComponent,
    UsuariosComponent,
    ProductosComponent,
    VentasComponent,
    PagesComponent,
    CambioPassComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
