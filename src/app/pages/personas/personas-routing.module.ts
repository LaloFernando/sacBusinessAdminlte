import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PersonComponent } from './person/person.component';
import { ListarComponent } from './listar/listar.component';
import { AuthGuard } from '../../guards/auth.guard';
import { PersonasComponent } from './personas.component';

const routes: Routes = [
  {
    path: 'personas',component: PersonasComponent,  data: {titulo: 'Personas'},
    children:[
      {path: '',component: ListarComponent, data: {titulo: 'Personas'}},
      {path: 'person',component: PersonComponent, canActivate: [AuthGuard], data: {titulo: 'Personas'}},

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
export class PersonasRoutingModule { }
