import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventarioRoutingModule } from './inventario-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { InventarioComponent } from './inventario.component';
import { InventaryComponent } from './inventary/inventary.component';
import { ListariComponent } from './listari/listari.component';

@NgModule({
  declarations: [
    InventarioComponent,
    InventaryComponent,
    ListariComponent
  ],exports:[
    InventaryComponent,
    ListariComponent
  ],
  imports: [
    InventarioRoutingModule,
    CommonModule,
    SharedModule,
    RouterModule
  ]
})
export class InventarioModule { }
