import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cambio-pass',
  templateUrl: './cambio-pass.component.html',
  styleUrls: ['./cambio-pass.component.css']
})
export class CambioPassComponent implements OnInit {

  pass = '';
  pass2 = '';
  hide = true;
  hide2 = true;

  public cambioContrasena = this.fb.group({
    
    anteriorPassword:['',[Validators.required,Validators.minLength(3)]],
    nuevaPassword:['',[Validators.required,Validators.minLength(3)]],

  });

  constructor(private usuarioSvc: UsuarioService, private fb:FormBuilder, private router:Router,public dialog: MatDialog) { }

  changePassword(){
    
    console.log('valores: ' + this.cambioContrasena);

    this.usuarioSvc.cambioPassword(localStorage.getItem('userId')!,this.cambioContrasena.value).subscribe(res=>{
        
      Swal.fire({
        icon:'success',
        title: 'La contraseña se actualizo correctamente...!!',
        confirmButtonText:'Ok'
      }).then((result)=>{

        if (result) {
          localStorage.removeItem('userId');
          this.dialog.closeAll();
        }

      });

    }, (err)=>{
          
      const errorPass = JSON.parse(err.error);

      Swal.fire('Error', errorPass.message, 'error');

    });
  
  }

  ngOnInit(): void {
  }

  getErrorMessage(campo: string){
    let message;
    if(this.cambioContrasena.get(campo)!.errors!.required){
      message = "Campo requerido...!!";
    }else if (this.cambioContrasena.get(campo)!.hasError('pattern')){
      message = "El email no es valido...!!";
    }else if (this.cambioContrasena.get(campo)!.hasError('minlength')){
      const minLength = this.cambioContrasena.get(campo)!.errors?.minlength.requiredLength;
      message = `El campo debe contener minimo ${minLength} caracteres...!!`;
    }
    return message;
  }

  isValidField(campo:string): boolean|any{
    return(
      (this.cambioContrasena.get(campo)?.touched || this.cambioContrasena.get(campo)?.dirty) && !this.cambioContrasena.get(campo)?.valid 
      //&& this.formSubmitted
    );
  }
}
