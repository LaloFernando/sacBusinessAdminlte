import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit,OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Usuario } from '../../models/usuario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RegisterForm } from '../../interfaces/register-Form.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements AfterViewInit,OnInit,OnDestroy {

  private subscription: Subscription = new Subscription;

  formSubmitted = false;

  listado = false;
  crear = false;
  editar = false;

  displayedColumns: string[] = ['Usuario', 'Nombre', 'Email', 'Contrasenia', 'Rol', 'Estado', 'Acciones'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  

  Roles: any = ['N-Administrador','S-Editor'];
  titulo = "Usuarios";

  hide = true;
  hide2 = true;
  isValidEmail = /\S+@\S+\.\S+/;

  suscription!: Subscription;

  public registerFormU = this.fb.group({
    US_CODCIA:   ['1'],
    US_CODIGO:   ['',[Validators.required,Validators.minLength(3)]],
    PE_CODIGO:   ['00000002'],
    US_PASSWORD: ['',[Validators.required,Validators.minLength(3)]],
    password2:   ['',[Validators.required]],
    US_PERMISO:  ['S',[Validators.required]],
    US_CODBODE:  ['01'],
    US_SERIEVTA: ['001-002'],
    US_NOMBRE:   ['',[Validators.required,Validators.minLength(3)]],
    US_EMAIL:    ['',[Validators.required,Validators.pattern(this.isValidEmail)]],
    US_ESTADO:   [false]
  },{
    validators: this.passwordsIguales('US_PASSWORD','password2')
  });

  usuarios$! : Observable<Usuario[]>;

  usuarios:Usuario[]=[];

  constructor(private fb:FormBuilder, private router:Router, private usuarioSvc:UsuarioService, private chref : ChangeDetectorRef,public dialog: MatDialog) { }

  guardarUsuario(){
    //console.log(this.registerFormU.value);
    this.formSubmitted = true;
    if (this.registerFormU.invalid) {
      return;
    }
    const newRegistro :RegisterForm = {
      US_CODCIA: '1',
      US_CODIGO: this.registerFormU.value.US_CODIGO,
      PE_CODIGO: this.registerFormU.value.PE_CODIGO,
      US_PASSWORD: this.registerFormU.value.US_PASSWORD,
      US_PERMISO: this.registerFormU.value.US_PERMISO.substring(0,1),
      US_CODBODE: '01',
      US_SERIEVTA: '001-002',
      US_NOMBRE: this.registerFormU.value.US_NOMBRE,
      US_EMAIL: this.registerFormU.value.US_EMAIL,
      US_ESTADO: 'AC',
    }
    //Realizar posteo
    if (this.editar == false) {
      //console.log(newRegistro);
      this.subscription.add(
        this.usuarioSvc.newUsuario(newRegistro).subscribe(res =>{

          Swal.fire('Exito', 'Usuario creado correctamente...!!', 'success');

          //this.usuarioSvc.clearCache();
            this.obtenerUsuario();
            this.cancelarform();
            this.chref.detectChanges();
          
        },(err)=>{

          const errorServer = JSON.parse(err.error);
          Swal.fire('Error', errorServer.message, 'error');

        })
      );

    }else{
      this.subscription.add(
        this.usuarioSvc.editarUsuario(localStorage.getItem('idUser')!, newRegistro).subscribe(res=>{

          Swal.fire({
            icon:'success',
            title:'Exito',
            text:'El usuario se actualizo correctamente',
            confirmButtonText:'Ok'
          }).then((result)=>{
    
            if (result) {
              this.obtenerUsuario();
              this.cancelarform();
              this.chref.detectChanges();
            }
    
          });
    
    
        },(err)=>{
          
            Swal.fire('Error', err.error.message, 'error');
    
        })
      );

    }
  }
  
  get roles(): any{
    return this.registerFormU.get('US_PERMISO');
  }

  cambioRol(e: any){

    this.roles.setValue(e.target.value, {
      onlySelf:true
    })
  }

  getErrorMessage(campo: string){
    let message;
    console.log(this.registerFormU.get(campo));
    if(this.registerFormU.get(campo)!.errors!.required){
      message = "Campo requerido...!!";
    }else if (this.registerFormU.get(campo)!.hasError('pattern')){
      message = "El email no es valido...!!";
    }else if (this.registerFormU.get(campo)!.hasError('minlength')){
      const minLength = this.registerFormU.get(campo)!.errors?.minlength.requiredLength;
      message = `El campo debe contener minimo ${minLength} caracteres...!!`;
    }else if (this.registerFormU.get(campo)!.hasError('noEsIgual')==true){
      message = "Las contraseñas deben ser iguales...!!";
    }
    return message;
  }

  isValidField(campo:string): boolean|any{
    return(
      (this.registerFormU.get(campo)?.touched || this.registerFormU.get(campo)?.dirty) && !this.registerFormU.get(campo)?.valid 
      //&& this.formSubmitted
    );
  }

  // contrasenaNoValidas(){

  //   const pass1 = this.registerFormU.get('US_PASSWORD')?.value;
  //   const pass2 = this.registerFormU.get('password2')?.value;
  //   //&& this.formSubmitted
  //   if ((pass1 !== pass2) ) {
  //     return true;
  //   }else{
  //     return false;
  //   }
  // }

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

  ngAfterViewInit():void{
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    
    this.obtenerUsuario();
    
    this.mostrarform('0');

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  obtenerUsuario(){
    this.subscription.add(
      this.usuarioSvc.obtenerUsuarios().subscribe((res: any) => {
        this.dataSource.data = res;
        this.chref.detectChanges();
      })
    )
  }

  // Mostrar formulario
  mostrarform(flag:string) {
    if (flag == '1') {
      this.listado = false;
      $("#listadoregistros").hide();
      this.crear = true;
      this.editar = false;

      $("#btnNuevo").hide();

      this.titulo = "Crear Usuario";
    } else if (flag == '2'){
      this.listado = false;
      $("#listadoregistros").hide();
      this.crear = true;
      this.editar = true;

      $("#btnNuevo").hide();

      this.titulo = "Editar Usuario";
    } else if (flag == '0'){
      this.listado = true;
      $("#listadoregistros").show();
      this.crear = false;
      this.editar = false;
      
      $("#btnNuevo").show();
      
      this.titulo = "Usuarios";
    }
  }

  //limpiamos la pantalla y la mostramos
  mostrarNuevo(){
    this.limpiar();
    this.mostrarform('1');
  }

  limpiar(){
    this.registerFormU.reset();    
    this.registerFormU.controls['US_CODCIA'].setValue('1');
    this.registerFormU.controls['PE_CODIGO'].setValue('00000002');
    this.registerFormU.controls['US_CODBODE'].setValue('01');
    this.registerFormU.controls['US_SERIEVTA'].setValue('001-002');
    this.registerFormU.controls['US_PERMISO'].setValue('S');
    this.registerFormU.controls['US_ESTADO'].setValue(true);
  }
  //cancelar form
  cancelarform() {
  
    localStorage.removeItem('idUser');
    localStorage.removeItem('userId');
    this.mostrarform('0');
  
  }

  llenarForm(id:string){
    
    this.mostrarform('2');
    this.subscription.add(
      this.usuarioSvc.obtenerIdUsuario(id).subscribe((res: any) => {

      this.registerFormU.setValue({
        
        US_CODCIA: res['US_CODCIA'],
        US_CODIGO: res['US_CODIGO'],
        PE_CODIGO: res['PE_CODIGO'],
        US_PASSWORD: '123',
        password2:   '123',
        US_PERMISO: res['US_PERMISO'],
        US_CODBODE: res['US_CODBODE'],
        US_SERIEVTA: res['US_SERIEVTA'],
        US_NOMBRE: res['US_NOMBRE'],
        US_EMAIL: res['US_EMAIL'],
        US_ESTADO: res['US_ESTADO'] == 'AC' ? true : false
      });

      localStorage.setItem('idUser', res['US_CODIGO']);

      })
    );
  }

  eliminarUsuario(id:string){
    let user = localStorage.getItem('user');
    if (id.toUpperCase() == user!.toUpperCase()) {
      Swal.fire('Error', 'No puede eliminar un usuario logeado...!!', 'error');
    }else if (id.toUpperCase() == 'SUPERVISOR') {
      Swal.fire('Error', 'No puede eliminar al usuario SUPERVISOR...!!', 'error');
    }else{
    
    Swal.fire({
      icon:'question',
      title:`Desea eliminar este usuario : << ${id} >> ?`,
      showCancelButton:true,
      confirmButtonText:'Confirmar'
    }).then((result)=>{
        if (result.isConfirmed) {
          this.subscription.add(
            this.usuarioSvc.deleteUsuario(id).subscribe((res:any)=>{
              
              Swal.fire({
                icon:'success',
                title:'Usuario eliminado correctamente',
                confirmButtonText:'Ok'            
              }).then((result)=>{
                  
                if (result) {
                  this.obtenerUsuario();
                }
    
              });
    
            }, (err)=>{
              Swal.fire('Error', err.error.message, 'error')
            })
          )
        }      

    });
 } 

  }

  ngOnDestroy():void{
    this.subscription.unsubscribe();
  }

  openDialog(id:string): void {
    
    let idUser = id;

    localStorage.setItem('userId',idUser);

    const config = {
      data: {
        message : "Cambiar Contraseña"
      },
      height: '45%',
      width: '45%',
      disableClose: true,
      autofocus: true
    }
    const dialogRef = this.dialog.open(DialogComponent, config);
    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialogo respuesta: ${result}`);
        localStorage.removeItem('userId');
      })
    );
  }
  
}
