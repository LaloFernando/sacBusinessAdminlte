import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[]=[{
    titulo: 'Escritorio',
    icono: 'nav-icon fas fa-tachometer-alt',
    submenu: [
      {titulo: 'Usuarios', icono: 'fa fa-user ml-2', url: 'usuarios'},
      {titulo: 'Personas', icono: 'fa fa-users ml-2', url: 'personas'},
      {titulo: 'Productos', icono: 'fas fa-gifts ml-2', url: 'productos'},
      {titulo: 'Inventarios', icono: 'fas fa-grip-vertical ml-2', url: 'inventarios'},
      {titulo: 'Ventas', icono: 'fas fa-shopping-basket ml-2', url: 'ventas'}
    ]
  }]
  constructor() { }
}
