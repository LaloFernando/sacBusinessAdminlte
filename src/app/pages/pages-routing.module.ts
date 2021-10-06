import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProductosComponent } from './productos/productos.component';
import { VentasComponent } from './ventas/ventas.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',component: PagesComponent, canActivate: [AuthGuard],
    children:[
      {path: '',component: DashboardComponent, data: {titulo: 'Escritorio'}},
      {path: 'usuarios',component: UsuariosComponent, data: {titulo: 'Usuarios'}},
      {path: 'productos',component: ProductosComponent, data: {titulo: 'Productos'}},
      {path: 'ventas',component: VentasComponent, data: {titulo: 'Ventas'}}
    ]
  }
  
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PagesRoutingModule { }
