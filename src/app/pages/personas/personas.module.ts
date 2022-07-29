import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonasRoutingModule } from './personas-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { PersonComponent } from './person/person.component';
import { ListarComponent } from './listar/listar.component';
import { PersonasComponent } from './personas.component';

@NgModule({
  declarations: [
    PersonasComponent,
    PersonComponent,
    ListarComponent
  ],exports:[
    PersonComponent,
    ListarComponent
  ],imports: [
    PersonasRoutingModule,
    CommonModule,
    SharedModule,
    RouterModule
  ]
})
export class PersonasModule { }
