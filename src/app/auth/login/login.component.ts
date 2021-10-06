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
  
  public loginForm = this.fb.group({
  
    usuario:  [localStorage.getItem('user'), [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    remember: [false]
  });

  constructor(private router:Router, private fb:FormBuilder, private usuarioSvc:UsuarioService) { }

  login(){
      
    console.log(this.loginForm.value);
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

}
