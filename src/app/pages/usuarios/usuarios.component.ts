import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit,OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit,OnDestroy {
  
  dtOptions: DataTables.Settings = {};
  usuarios:Usuario[]=[];
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private usuarioSvC: UsuarioService) { }

  ngOnInit(): void {
    
    this.obtenerUsuario();
    
    this.dtOptions = {
      pageLength: 10,
      searching: true,
      responsive:true,
      info:true,
      language:{url:'//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'}
    };
    

  }

  obtenerUsuario(){

    this.usuarioSvC.obtenerUsuarios().subscribe((res: any) => {

    this.usuarios = res;
    this.dtTrigger.next();

    })
  }

  ngOnDestroy(){
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
