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
    US_CODIGO: ['',[Validators.required]],
    PE_CODIGO: ['00000002'],
    US_PASSWORD: ['',[Validators.required]],
    password2: ['',[Validators.required]],
    US_PERMISO: ['',[Validators.required]],
    US_CODBODE: ['01'],
    US_SERIEVTA: ['001-002']
  },{
    validators: this.passwordsIguales('US_PASSWORD','password2')
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

  campoNoValido(campo:string):boolean{
    if ( this.registerForm.get(campo)?.invalid && this.formSubmitted ) {

      return true;
    }else{
      return false;
    }
  }

  contrasenaNoValidas(){

    const pass1 = this.registerForm.get('US_PASSWORD')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    if ((pass1 !== pass2) && this.formSubmitted) {
      return true;
    }else{
      return false;
    }
  }

  passwordsIguales(pass1Name: string, pass2Name: string){
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null);
      }else{
        pass2Control?.setErrors({noEsIgual:true});
      }
    }
  }

}
