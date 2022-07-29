import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InventaryComponent } from './inventary/inventary.component';
import { ListariComponent } from './listari/listari.component';
import { InventarioComponent } from './inventario.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: 'inventarios',component: InventarioComponent,  data: {titulo: 'Inventarios'},
    children:[
      {path: '',component: ListariComponent, data: {titulo: 'Inventarios'}},
      {path: 'inventory',component: InventaryComponent, canActivate: [AuthGuard], data: {titulo: 'Inventarios'}},

    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class InventarioRoutingModule { }
