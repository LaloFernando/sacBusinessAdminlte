import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductComponent } from './product/product.component';
import { ListaraComponent } from './listara/listara.component';
import { AuthGuard } from '../../guards/auth.guard';
import { ProductosComponent } from './productos.component';

const routes: Routes = [
  {
    path: 'productos',component: ProductosComponent,  data: {titulo: 'Productos'},
    children:[
      {path: '',component: ListaraComponent, data: {titulo: 'Productos'}},
      {path: 'product',component: ProductComponent, canActivate: [AuthGuard], data: {titulo: 'Productos'}},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
