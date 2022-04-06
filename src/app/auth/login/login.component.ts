import { UsuarioService } from './../../services/usuario.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  hide = true;

  public loginForm = this.fb.group({
  
    usuario:  [localStorage.getItem('user'), [Validators.required]],
    password: ['', [Validators.required]],
    remember: [false]
  });

  constructor(private router:Router, private fb:FormBuilder, private usuarioSvc:UsuarioService) { }

  login(){
      
    //console.log(this.loginForm.value);
    this.usuarioSvc.login(this.loginForm.value).subscribe(res => {
      if (this.loginForm.get('remember')?.value) {
        localStorage.setItem('user',this.loginForm.get('usuario')?.value);
      }else{
        localStorage.removeItem('user');
      }
      this.router.navigateByUrl('/dashboard')
    },(err) => {
      Swal.fire('Error', err.error.message,'error');
    });

  }

  getErrorMessage(campo: string): string{
    let message:string='';
    if(this.loginForm.get(campo)?.errors!.required){
      message = "Campo requerido...!!";
    }else if (this.loginForm.get(campo)?.hasError('pattern')){
      message = "El email no es valido...!!";
    }else if (this.loginForm.get(campo)?.hasError('minLength')){
      const minLength = this.loginForm.get(campo)?.errors!.minLength.requiredLength;
      message = `El campo debe contener minimo ${minLength} caracteres...!!`;
    }
    return message;
  }

  isValidField(campo:string): boolean|any{
    return(
      (this.loginForm.get(campo)?.touched || this.loginForm.get(campo)?.dirty) && !this.loginForm.get(campo)?.valid
    );
  }

}
