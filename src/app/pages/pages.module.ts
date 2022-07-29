import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { DataTablesModule } from "angular-datatables";

import { PagesRoutingModule } from "./pages-routing.module";
import { SharedModule } from './../shared/shared.module';

import { DashboardComponent } from './dashboard/dashboard.component';

import { UsuariosComponent } from './usuarios/usuarios.component';
import { PersonasComponent } from './personas/personas.component';
import { ProductosComponent } from './productos/productos.component';
import { InventarioComponent } from './inventario/inventario.component';
import { VentasComponent } from './ventas/ventas.component';

import { CambioPassComponent } from './usuarios/cambio-pass/cambio-pass.component';
import { PagesComponent } from './pages.component';
import { PersonComponent } from './personas/person/person.component';
import { ListarComponent } from './personas/listar/listar.component';
import { ProductComponent } from './productos/product/product.component';
import { ListaraComponent } from './productos/listara/listara.component';
import { InventaryComponent } from './inventario/inventary/inventary.component';
import { ListariComponent } from './inventario/listari/listari.component';


@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    UsuariosComponent,
    VentasComponent,
    CambioPassComponent,
    PersonasComponent,
    ProductosComponent,
    InventarioComponent,
    PersonComponent,
    ListarComponent,
    ProductComponent,
    ListaraComponent,
    InventaryComponent,
    ListariComponent
  ],
  exports: [
    DashboardComponent,
    UsuariosComponent,
    PersonasComponent,
    ProductosComponent,
    InventarioComponent,
    VentasComponent,
    CambioPassComponent,
    PersonComponent,
    ListarComponent,
    ProductComponent,
    ListaraComponent,
    InventaryComponent,
    ListariComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }

