import { UsuarioService } from './../../services/usuario.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  formSubmitted = false;
  Roles: any = ['S','N'];

  public registerForm = this.fb.group({
    US_CODCIA: ['1'],
    US_CODIGO: ['ERICK',[Validators.required]],
    PE_CODIGO: ['00000002'],
    US_PASSWORD: ['123',[Validators.required]],
    password2: ['123',[Validators.required]],
    US_PERMISO: ['',[Validators.required]],
    US_CODBODE: ['01'],
    US_SERIEVTA: ['001-002']
  });

  constructor(private fb:FormBuilder, private router:Router, private usuarioSvc:UsuarioService) { }

  crearUsuario(){
    this.formSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    //Realizar posteo
    this.usuarioSvc.newUsuario(this.registerForm.value).subscribe(res =>{

    Swal.fire('Exito', 'Usuario creado correctamente...!!', 'success');

    },(err)=>{

      const errorServer = JSON.parse(err.error);
      Swal.fire('Error', errorServer.message, 'error');

    });
  }

  get roles(): any{
    return this.registerForm.get('US_PERMISO');
  }

  cambioRol(e: any){
    console.log(e.target.value);
    this.roles.setValue(e.target.value, {
      onlySelf:true
    })
  }
}
