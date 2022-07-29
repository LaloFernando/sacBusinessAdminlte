import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PersonasComponent } from './personas/personas.component';
import { ProductosComponent } from './productos/productos.component';
import { VentasComponent } from './ventas/ventas.component';

import { ListarComponent } from './personas/listar/listar.component';
import { PersonComponent } from './personas/person/person.component';
import { ListaraComponent } from './productos/listara/listara.component';
import { ProductComponent } from './productos/product/product.component';

import { AuthGuard } from '../guards/auth.guard';
import { NopageFoundComponent } from '../nopage-found/nopage-found/nopage-found.component';
import { InventarioComponent } from './inventario/inventario.component';
import { InventaryComponent } from './inventario/inventary/inventary.component';
import { ListariComponent } from './inventario/listari/listari.component';

const routes: Routes = [
  {
    path: 'dashboard',component: PagesComponent, canActivate: [AuthGuard],
    children:[
      {path: '',component: DashboardComponent, data: {titulo: 'Escritorio'}},
      {path: 'usuarios',component: UsuariosComponent,  data: {titulo: 'Usuarios'}},
      {path: 'personas',component: PersonasComponent,  data: {titulo: 'Personas'},
        children:[
          {path: '',component: ListarComponent, data: {titulo: 'Personas'}},
          {path: 'person',component: PersonComponent, canActivate: [AuthGuard], data: {titulo: 'Personas'}},
          {path: '**', component: NopageFoundComponent}
        ]
      },
      {path: 'productos',component: ProductosComponent,  data: {titulo: 'Productos'},
        children:[
          {path: '',component: ListaraComponent, data: {titulo: 'Productos'}},
          {path: 'product',component: ProductComponent, canActivate: [AuthGuard], data: {titulo: 'Productos'}},
          {path: '**', component: NopageFoundComponent}
        ]
      },
      {path: 'inventarios',component: InventarioComponent,  data: {titulo: 'Inventarios'},
        children:[
          {path: '',component: ListariComponent, data: {titulo: 'Inventarios'}},
          {path: 'inventory',component: InventaryComponent, canActivate: [AuthGuard], data: {titulo: 'Inventarios'}},
          {path: '**', component: NopageFoundComponent}
        ]
      },
      {path: 'ventas',component: VentasComponent,  data: {titulo: 'Ventas'}},
      {path: '**', component: NopageFoundComponent}
    ]
  }
  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PagesRoutingModule { }
