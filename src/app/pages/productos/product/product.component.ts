import { ProductoService } from './../../../services/producto.service';
import { Component, OnInit,OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Producto } from '../../../models/producto.model';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import   Swal from 'sweetalert2';
import { ProductoForm } from '../../../interfaces/producto-Form.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

//http://localhost:3000
const URL = environment.urlServer;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit,OnDestroy {

  private subscription: Subscription = new Subscription;

  private image:any;

  public verImage: string = '';
  quitarImg = false;
  
  public loading: boolean = false;

  formSubmitted = false;

  crear = false;
  editar = false;
  stock = 0;
  fechaUltCmp = '';
  fechaUltVta = '';

  Roles: any = ['BIEN','SERVICIO'];

  flagPersona:boolean = false;

  titulo = "Productos";

  isValidEmail = /\S+@\S+\.\S+/;
  isValidNumeros = /^(0|\-?[0-9][0-9]*)$/;
  isValidLetrasyCaracteres = '[a-zA-Z0-9/\. -@]{2,254}';
  isValidLetraNumero = /^[0-9a-zA-Z]+$/;
  isValidSoloLetrasNoVacio = /^[a-zA-Z]+$/;
  isValidNumeros2 = /^-?[0-9][^\.]*$/;

  public registerFormU = this.fb.group({
    AR_CODCIA:     ['1'],
    AR_CODKEY:     ['',[Validators.required,Validators.minLength(3),Validators.maxLength(18),Validators.pattern(this.isValidLetraNumero)]],
    AR_CODIGO:     ['',[Validators.minLength(3),Validators.maxLength(18),Validators.pattern(this.isValidLetraNumero)]],
    AR_DESCRIPCION:['',[Validators.minLength(3),Validators.maxLength(100),Validators.pattern(this.isValidLetrasyCaracteres)]],
    AR_ESPECIFICA: [''],
    AR_AFECSTOCK:  ['BIEN',[Validators.required]],
    AR_IMAGEN1:     [''],
    AR_IVA:        [true,[Validators.required]],
    AR_ESTADO:     [true],
    AR_CSTOCK:     ['1'],
    AR_PRECIODIS_DOLAR: ['0.0000',[Validators.required,Validators.min(0.0001),Validators.max(999999.9999)]],
    AR_PORPREDIS:   ['0',[Validators.required,Validators.min(0.00)]],
    AR_COSTO_DOLAR: ['0.0000',[Validators.required,Validators.min(0.0001),Validators.max(999999.9999)]],
    AR_COSTOFAC:    ['0.00'],
  });

  productos:Producto[] = [];


  constructor(private fb:FormBuilder, private router:Router, private productoSvc:ProductoService, private chref : ChangeDetectorRef, private _location: Location, private sanitizer: DomSanitizer) { 
    this.getArgumentos()
  }

  getArgumentos(){

    this.router.events
     .pipe(
        filter((event): event is ActivationEnd => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data)
      )
      .subscribe(({ titulo }) => {
        this.titulo = titulo;
        document.title = `SacBusiness | ${titulo}`;
      })
  
  }

  guardarProducto(){
    this.formSubmitted = true;

    //pregunta,os si es valido el formulario para continuar
    if (this.registerFormU.invalid) {
      Swal.fire('Notificación', 'Por favor, verifique que los campos obligatorios esten correctamente ingresados...!!', 'warning');
      this.registerFormU.markAllAsTouched();
      return ;
    }

    const newRegistro :ProductoForm = {
      AR_CODCIA:      '1',
      AR_CODKEY:      this.registerFormU.value.AR_CODKEY,
      AR_CODIGO:      this.registerFormU.value.AR_CODIGO,
      AR_DESCRIPCION: this.registerFormU.value.AR_DESCRIPCION,
      AR_ESPECIFICA:  this.registerFormU.value.AR_ESPECIFICA,
      AR_AFECSTOCK:   this.registerFormU.value.AR_AFECSTOCK == 'BIEN' ? '1' : '0',
      AR_IMAGEN1:     this.registerFormU.value.AR_IMAGEN1,
      AR_IVA:         this.registerFormU.value.AR_IVA ? '1' : '0',
      AR_ESTADO:      this.registerFormU.value.AR_ESTADO ? 'AC' : 'IN',
      AR_CSTOCK:      this.registerFormU.value.AR_CSTOCK,
      AR_PRECIODIS_DOLAR: this.registerFormU.value.AR_PRECIODIS_DOLAR,
      AR_PORPREDIS:   this.registerFormU.value.AR_PORPREDIS,
      AR_COSTO_DOLAR: this.registerFormU.value.AR_COSTO_DOLAR,
      AR_COSTOFAC:    this.registerFormU.value.AR_COSTOFAC,
    }

    //Realizar posteo
    // console.log(newRegistro)
    if (this.editar == false) {
      try{
        this.loading = true;
        this.subscription.add(
          this.productoSvc.newProducto(newRegistro,this.image).subscribe(res =>{

            if (JSON.parse(res).estado === '1'){
              Swal.fire('Exito', JSON.parse(res).message, 'success');
            }else{
              Swal.fire({
                icon: 'info',
                title: 'Informativo',
                html: JSON.parse(res).message + '<br><br> CODIGO: ' + JSON.parse(res).data.AR_CODKEY + 
                                                '<br> DESCRIPCION : ' + JSON.parse(res).data.AR_DESCRIPCION+
                                                '<br> ESTADO : ' + JSON.parse(res).data.AR_ESTADO,
                
              })
            }

            //this.usuarioSvc.clearCache();
            if (JSON.parse(res).estado === '1'){
              this.obtenerProducto()
              this.cancelarform();
              this.chref.detectChanges();
            }

          },(err)=>{
            this.loading = false;
            const errorServer = JSON.parse(err.error);
            Swal.fire('Error', errorServer.message, 'error');

          })
        );
      }catch (e) {
       this.loading = false;
       console.log('ERROR', e);
     }
      
    }else{ 
      // console.log(newRegistro)
      try {
        let idProducto = localStorage.getItem('idProduct');
        let nomImgProduct = localStorage.getItem('nomImgProduct') =='' ? 'X' : localStorage.getItem('nomImgProduct') ;
        this.loading = true;
        this.subscription.add(
          this.productoSvc.editarProducto(idProducto!,nomImgProduct!,this.image, newRegistro).subscribe(res =>{
            
            if (JSON.parse(JSON.stringify(res)).estado === '1'){
              Swal.fire('Exito', JSON.parse(JSON.stringify(res)).message, 'success');
            }else{
              Swal.fire({
                icon: 'info',
                title: 'Informativo',
                html: JSON.parse(JSON.stringify(res)).message + 
                                                '<br><br> CODIGO: ' + JSON.parse(JSON.stringify(res)).data.AR_CODKEY + 
                                                '<br> DESCRIPCION : ' + JSON.parse(JSON.stringify(res)).data.AR_DESCRIPCION+
                                                '<br> ESTADO : ' + JSON.parse(JSON.stringify(res)).data.AR_ESTADO,
                
              })
            }
  
            //this.usuarioSvc.clearCache();
            if (JSON.parse(JSON.stringify(res)).estado === '1'){
              this.obtenerProducto()
                this.cancelarform();
                this.chref.detectChanges();
            }
    
          },(err)=>{
            this.loading = false;
            Swal.fire('Error', err.error.message, 'error');
      
          })
        );
      }catch (e) {
        this.loading = false;
        console.log('ERROR', e);
      }
      

    }
  }

  get roles(): any{
    return this.registerFormU.get('AR_AFECSTOCK');
  }

  cambioRol(e: any){
    this.roles.setValue(e.target.value, {
      onlySelf:true
    })
  }

  getErrorMessage(campo: string){
    let message;
    if(this.registerFormU.get(campo)!.errors!.required){
      message = "Campo requerido...!!";
    }
    if (this.registerFormU.get(campo)!.hasError('minlength')){
      const minLength = this.registerFormU.get(campo)!.errors?.minlength.requiredLength;
      message = `El campo debe contener mínimo ${minLength} caracteres...!!`;
    }
    if (this.registerFormU.get(campo)!.hasError('maxlength')){
      const maxLength = this.registerFormU.get(campo)!.errors?.maxlength.requiredLength;
      message = `El campo debe contener máximo ${maxLength} caracteres...!!`;
    }
    if (this.registerFormU.get(campo)!.hasError('pattern')){
      if (campo == 'AR_CODKEY' || campo == 'AR_CODIGO'){
        message = "Solo se aceptan letras y números en el formato indicado...!!";
      }else{
        message = "Solo se aceptan letras en el formato indicado...!!";
      }
    }
    return message;
  }

  isValidField(campo:string): boolean|any{
    return(
      (this.registerFormU.get(campo)?.touched || this.registerFormU.get(campo)?.dirty ) && !this.registerFormU.get(campo)?.valid 
      //&& this.formSubmitted
    );
  }

  ngOnInit(): void {
    
    let tipoPantalla = localStorage.getItem('tipoPantalla');

    if (tipoPantalla === '1') {
      this.mostrarform('1')
    }else{ 
      let idProduct = localStorage.getItem('idProduct');
      this.mostrarform('2');
      this.llenarForm(idProduct!);
    }

  }

  ngOnDestroy():void{
    this.subscription.unsubscribe();
  }

  obtenerProducto(){
    this.subscription.add(
      this.productoSvc.obtenerProductos().subscribe((res: any) => {
        // console.log(res)
        this.productos=res;
        })
    )
  }

  // Mostrar formulario
  mostrarform(flag:string) {
    if (flag == '1') {
      this.crear = true;
      this.editar = false;
      this.titulo = "Crear Producto";
    } else if (flag == '2'){
      this.crear = true;
      this.editar = true;
      this.titulo = "Editar Producto";
    }
  }

  //limpiamos la pantalla y la mostramos
  mostrarNuevo(){
    this.mostrarform('1');
  }

  //cancelar form
  cancelarform() {
    localStorage.removeItem('idProduct');
    localStorage.removeItem('tipoPantalla');
    localStorage.removeItem('nomImgProduct');
    this._location.back();
  }

  llenarForm(id:string){
  let imagen = 'X';

    this.mostrarform('2');
    this.subscription.add(
      this.productoSvc.obtenerIdProducto(id).subscribe((res: any) => {
        // console.log(res.producto['AR_IMAGEN1'])
        if (res.producto['AR_IMAGEN1'] !== ''){
          imagen = res.producto['AR_IMAGEN1'];
        }
        this.verImage =  `${URL}/products/products/${imagen}`; 
        this.image = imagen; 
        this.quitarImg = false;

        this.registerFormU.setValue({
          AR_CODCIA:      res.producto['AR_CODCIA'],
          AR_CODKEY:      res.producto['AR_CODKEY'],
          AR_CODIGO:      res.producto['AR_CODIGO'],
          AR_DESCRIPCION: res.producto['AR_DESCRIPCION'],
          AR_ESPECIFICA:  res.producto['AR_ESPECIFICA'],
          AR_AFECSTOCK:   res.producto['AR_AFECSTOCK'] == '1' ? 'BIEN' : 'SERVICIO',
          AR_IMAGEN1:     this.verImage,
          AR_IVA:         res.producto['AR_IVA'] == '1' ? true : false,
          AR_ESTADO:      res.producto['AR_ESTADO'] == 'AC' ? true : false,
          AR_CSTOCK:      res.producto['AR_CSTOCK'],
          AR_PRECIODIS_DOLAR: res.producto['AR_PRECIODIS_DOLAR'],
          AR_PORPREDIS:   res.producto['AR_PORPREDIS'],
          AR_COSTO_DOLAR: res.producto['AR_COSTO_DOLAR'],
          AR_COSTOFAC:    res.producto['AR_COSTOFAC'],
        });

        this.stock = res.producto['AR_STOCK'];
        this.fechaUltCmp = res.producto['AR_FECULTCOM'];
        this.fechaUltVta = res.producto['AR_FECULTVTA'];

        console.log(this.fechaUltCmp);

      },(err)=>{
          
        Swal.fire('Error', err.error.message, 'error');
        this.cancelarform();

    })
    );
  }

  obtenerIdentificacionProducto(aux:string){
    let id:any = localStorage.getItem('idProduct');
    this.subscription.add(
      this.productoSvc.obtenerIdentificacionProducto(id,aux).subscribe((res) => {

        if (JSON.parse(JSON.stringify(res)).estado === '1'){
          
        }else{

          Swal.fire({
            icon: 'info',
            title: 'Informativo',
            html: JSON.parse(JSON.stringify(res)).message +
                                            '<br><br> CODIGO: ' + JSON.parse(JSON.stringify(res)).data.AR_CODKEY + 
                                            '<br> DESCRIPCION : ' + JSON.parse(JSON.stringify(res)).data.AR_DESCRIPCION+
                                            '<br> ESTADO : ' + JSON.parse(JSON.stringify(res)).data.AR_ESTADO,
            
          })
        }

      })
    );
  }

  capturarImage(event:any) : void{
    this.image = event.target.files[0];
    // console.log(this.image)
    this.extraerBase64(this.image).then((imagen:any) => {
      this.verImage = imagen.base;
      this.quitarImg = true;
      // console.log(this.verImage)
    });
    // this.archivos.push(this.image);
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject): any => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  })

  clearImage(): any {
    this.verImage = this.registerFormU.get("AR_IMAGEN1")!.value;
    this.image = [];
    this.quitarImg = false;
    // console.log(this.verImage)
    // this.archivos = [];
  }

}

