import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { PersonaService } from './../../../services/persona.service';
import { Component, OnInit,OnDestroy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Persona, Plazo, Ciudad } from '../../../models/persona.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import   Swal from 'sweetalert2';
import { PersonForm } from '../../../interfaces/person-Form.interface';
import { MatDialog } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';

export interface Email {
  name: string;
  invalid:boolean;
}

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PersonComponent implements OnInit,OnDestroy {

  private subscription: Subscription = new Subscription;

  formSubmitted = false;

  crear = false;
  editar = false;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emails:Email[] = [];

  removable = true;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our emails
    if (value) {
      if (this.validateEmail(value)) {
        this.emails.push({ name: value, invalid: false });
      } else {
        this.emails.push({ name: value, invalid: true });
        this.registerFormU.controls['PE_EMAIL'].setErrors({'incorrectEmail': true});
      }
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(email: Email): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    } 
    
  }

  private validateArrayNotEmpty(c: FormControl) {
    if (c.value && c.value.length === 0) {
      return {
        validateArrayNotEmpty: { valid: false }
      };
    }
    return null;
  }
  
  private validateEmail(email: any) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  Roles: any = ['RUC','CEDULA','PASAPORTE'];
  Terminos: any = ['CONTADO','CREDITO'];

  flagPersona:boolean = false;

  titulo = "Personas";
  placeHolder = "Razón Social";

  isValidEmail = /\S+@\S+\.\S+/;
  isValidNumeros = /^(0|\-?[0-9][0-9]*)$/;
  isValidLetras = '[a-zA-Z\. ]{2,254}';
  isValidNumeros2 = /^-?[0-9][^\.]*$/;

  public registerFormU = this.fb.group({
    PE_CODCIA:    ['1'],
    PE_CEDULA:    ['',[Validators.required]],
    PE_NOMBRE:    ['',[Validators.required,Validators.minLength(3),Validators.maxLength(100),Validators.pattern(this.isValidLetras)]],
    PE_APELLIDO:  ['',[Validators.minLength(3),Validators.maxLength(100)]],
    PE_DIRECCION: ['',[Validators.required,Validators.minLength(5),Validators.maxLength(100)]],
    PE_TELEFONO1: ['',[Validators.minLength(10),Validators.pattern(this.isValidNumeros)]],
    PE_FAX:       ['',[Validators.required,Validators.minLength(10),Validators.pattern(this.isValidNumeros)]],
    PE_CIUDADNAC: ['07',[Validators.required]],
    PE_EMAIL:     ['', this.validateArrayNotEmpty],
    PE_ESTADO:    [true],
    PE_IDENTIFICACION: ['RUC',[Validators.required]],
    PE_FPAGO:['CONTADO'],
    PE_PLAZO:['0'],
    PE_TIPOC:[false],
    PE_TIPOP:[false],
    PE_TIPOT:[false],
    PE_TIPOO:[false],
  },{
    validators: this.validarIdentifica('PE_CEDULA','PE_IDENTIFICACION')
  });

  personas:Persona[] = [];
  Plazos: Plazo[] = [];
  Ciudades: Ciudad[] = [];

  constructor(private fb:FormBuilder, private router:Router, private personaSvc:PersonaService, private chref : ChangeDetectorRef,public dialog: MatDialog,private _location: Location) { 

    this.registerFormU.get("PE_IDENTIFICACION")!.valueChanges
      .subscribe(data=> {
        this.cambiarValidators()
      })

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

  cambiarValidators(){
    if (this.registerFormU.get("PE_IDENTIFICACION")!.value=="RUC") {
      this.registerFormU.controls["PE_CEDULA"].setValidators([Validators.required,Validators.minLength(13),Validators.minLength(13),Validators.pattern("^[0-9]*$")]);
      this.placeHolder="Razón Social";
    } else if (this.registerFormU.get("PE_IDENTIFICACION")!.value=="CEDULA") {
      // this.registerFormU.controls["PE_CEDULA"].clearValidators();
      this.registerFormU.controls["PE_CEDULA"].setValidators([Validators.required,Validators.minLength(10),Validators.minLength(10),Validators.pattern("^[0-9]*$")]);
      this.registerFormU.controls['PE_CEDULA'].setValue(this.registerFormU.get("PE_CEDULA")!.value.substring(0,10));
      this.placeHolder="Nombres y Apellidos";
    }else{
      this.registerFormU.controls["PE_CEDULA"].setValidators([Validators.required,Validators.minLength(6),Validators.minLength(12),Validators.pattern("^[A-Za-z0-9,-]*$")]);
      this.placeHolder="Nombres y Apellidos";
    }
    this.registerFormU.get("PE_CEDULA")!.updateValueAndValidity();
  }

  guardarPersona(){
    let tipoPerson:string ='';
    let emails:string ='';
    this.formSubmitted = true;

    //pregunta,os si es valido el formulario para continuar
    if (this.registerFormU.invalid) {
      Swal.fire('Notificación', 'Por favor, verifique que los campos obligatorios esten correctamente ingresados...!!', 'warning');
      this.registerFormU.markAllAsTouched();
      return ;
    }

    if (this.registerFormU.value.PE_TIPOC == true){
      tipoPerson = '1'
    }else{
      tipoPerson = '0'
    }
    if (this.registerFormU.value.PE_TIPOP == true){
      tipoPerson = tipoPerson + '1'
    }else{
      tipoPerson = tipoPerson + '0'
    }
    if (this.registerFormU.value.PE_TIPOT == true){
      tipoPerson = tipoPerson + '1'
    }else{
      tipoPerson = tipoPerson + '0'
    }
    if (this.registerFormU.value.PE_TIPOO == true){
      tipoPerson = tipoPerson + '1'
    }else{
      tipoPerson = tipoPerson + '0'
    }

    for (let email of this.emails){
      emails = emails + email['name'] + ';';
    }
    emails = emails.substring(0,emails.length-1);

    const newRegistro :PersonForm = {
      PE_CODCIA:    '1',
      PE_CEDULA:    this.registerFormU.value.PE_CEDULA,
      PE_NOMBRE:    this.registerFormU.value.PE_NOMBRE,
      PE_APELLIDO:  this.registerFormU.value.PE_APELLIDO,
      PE_DIRECCION: this.registerFormU.value.PE_DIRECCION,
      PE_TELEFONO1: this.registerFormU.value.PE_TELEFONO1,
      PE_FAX:       this.registerFormU.value.PE_FAX,
      PE_CIUDADNAC: this.registerFormU.value.PE_CIUDADNAC,
      PE_EMAIL:     emails,
      PE_ESTADO:    this.registerFormU.value.PE_ESTADO ? 'AC' : 'IN',
      PE_IDENTIFICACION: this.registerFormU.value.PE_IDENTIFICACION.substring(0,1),
      PE_FPAGO:     this.registerFormU.value.PE_FPAGO === 'CONTADO' ? 'C' : 'D',
      PE_PLAZO:     this.registerFormU.value.PE_PLAZO,
      PE_TIPOCLI:   tipoPerson,
    }

    //Realizar posteo

    if (this.editar == false) {
      this.subscription.add(
        this.personaSvc.newPersona(newRegistro).subscribe(res =>{

          if (JSON.parse(res).estado === '1'){
            Swal.fire('Exito', JSON.parse(res).message, 'success');
          }else{
            Swal.fire({
              icon: 'info',
              title: 'Informativo',
              html: JSON.parse(res).message + '<br><br> TIPO : ' + JSON.parse(res).data.PE_IDENTIFICACION + 
                                              '<br> IDENTIFICACION: ' + JSON.parse(res).data.PE_CEDULA + 
                                              '<br> NOMBRES : ' + JSON.parse(res).data.PE_NOMBRE+
                                              '<br> ESTADO : ' + JSON.parse(res).data.PE_ESTADO,
              
            })
          }

          //this.usuarioSvc.clearCache();
          if (JSON.parse(res).estado === '1'){
            this.obtenerPersona()
            this.cancelarform();
            this.chref.detectChanges();
          }

        },(err)=>{

          const errorServer = JSON.parse(err.error);
          Swal.fire('Error', errorServer.message, 'error');

        })
      );
    }else{ 
      // console.log(newRegistro)
      this.subscription.add(
        this.personaSvc.editarPersona(localStorage.getItem('idPerson')!, newRegistro).subscribe(res =>{
          
          if (JSON.parse(JSON.stringify(res)).estado === '1'){
            Swal.fire('Exito', JSON.parse(JSON.stringify(res)).message, 'success');
          }else{
            Swal.fire({
              icon: 'info',
              title: 'Informativo',
              html: JSON.parse(JSON.stringify(res)).message + '<br><br> TIPO : ' + JSON.parse(JSON.stringify(res)).data.PE_IDENTIFICACION + 
                                              '<br> IDENTIFICACION: ' + JSON.parse(JSON.stringify(res)).data.PE_CEDULA + 
                                              '<br> NOMBRES : ' + JSON.parse(JSON.stringify(res)).data.PE_NOMBRE+
                                              '<br> ESTADO : ' + JSON.parse(JSON.stringify(res)).data.PE_ESTADO,
              
            })
          }

          //this.usuarioSvc.clearCache();
          if (JSON.parse(JSON.stringify(res)).estado === '1'){
            this.obtenerPersona()
              this.cancelarform();
              this.chref.detectChanges();
          }
  
        },(err)=>{
          
            Swal.fire('Error', err.error.message, 'error');
    
        })
      );

    }
  }

  get emailField(){
    return this.registerFormU.get('PE_EMAIL');
  }
  
  get roles(): any{
    return this.registerFormU.get('PE_IDENTIFICACION');
  }

  get terminos(): any{
    return this.registerFormU.get('PE_FPAGO');
  }

  get plazos(): any{
    return this.registerFormU.get('PE_PLAZO');
  }

  get ciudades(): any{
    return this.registerFormU.get('PE_CIUDADNAC');
  }

  cambioRol(e: any){
    this.roles.setValue(e.target.value, {
      onlySelf:true
    })
  }

  cambioTermino(e: any){
    if (e.target.value=="CONTADO"){
      this.registerFormU.controls['PE_PLAZO'].setValue('0');
    }
    this.terminos.setValue(e.target.value, {
      onlySelf:true
    })
  }

  cambioPlazo(e: any){
    this.plazos.setValue(e.target.value, {
      onlySelf:true
    })
  }

  cambioCiudad(e: any){
    this.ciudades.setValue(e.target.value, {
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
      if (campo == 'PE_EMAIL'){
        message = "El email no es valido...!!";
      }else if (campo == 'PE_CEDULA' || campo == 'PE_FAX' || campo == 'PE_TELEFONO1'){
        message = "Solo se aceptan números...!!";
      }else if (campo == 'PE_NOMBRE'){
        message = "Solo se aceptan letras...!!";
      }
    }
    if (this.registerFormU.get(campo)!.hasError('noIdentifa')==true){
      message = "No es una Identificación válida...!!";
    }
    return message;
  }

  isValidField(campo:string): boolean|any{
    return(
      (this.registerFormU.get(campo)?.touched || this.registerFormU.get(campo)?.dirty ) && !this.registerFormU.get(campo)?.valid 
      //&& this.formSubmitted
    );
  }

  validarIdentifica(iden: string,tipo: string){
    return (formGroup: FormGroup) => {
      const idenfControl = formGroup.get(iden);
      const tipoIControl = formGroup.get(tipo);
      
      if (tipoIControl!.value=="CEDULA") {
        if (idenfControl!.value.length==10) {
          if (verificadorCedula(idenfControl!.value)) {
            idenfControl?.setErrors(null);
          }else{
            idenfControl?.setErrors({noIdentifa:true});
          }
        }
      }
    }
  }

  ngOnInit(): void {
    
    let tipoPantalla = localStorage.getItem('tipoPantalla');

    this.obtenerPlazos();
    this.obtenerCiudades();
    if (tipoPantalla === '1') {
      this.mostrarform('1')
    }else{ 
      let idPerson = localStorage.getItem('idPerson');
      this.mostrarform('2');
      this.llenarForm(idPerson!);
    }

  }

  ngOnDestroy():void{
    this.subscription.unsubscribe();
  }

  obtenerPlazos(){
    this.subscription.add(
      this.personaSvc.obtenerPlazos().subscribe((res: any) => {
        this.Plazos = res;
      })
    );
  }

  obtenerCiudades(){
    this.subscription.add(
      this.personaSvc.obtenerCiudades().subscribe((res: any) => {
        this.Ciudades = res;
      })
    );
  }

  obtenerPersona(){
    this.subscription.add(
      this.personaSvc.obtenerPersonas().subscribe((res: any) => {
        // console.log(res)
        this.personas=res;
        })
    )
  }

  // Mostrar formulario
  mostrarform(flag:string) {
    if (flag == '1') {
      this.crear = true;
      this.editar = false;
      this.titulo = "Crear Persona";
    } else if (flag == '2'){
      this.crear = true;
      this.editar = true;
      this.titulo = "Editar Persona";
    }
  }

  //limpiamos la pantalla y la mostramos
  mostrarNuevo(){
    this.limpiar();
    this.mostrarform('1');
  }

  limpiar(){
    this.emails = [];
    this.registerFormU.reset();    
    this.registerFormU.controls['PE_CODCIA'].setValue('1');
    this.registerFormU.controls['PE_CEDULA'].setValue('');
    this.registerFormU.controls['PE_NOMBRE'].setValue('');
    this.registerFormU.controls['PE_APELLIDO'].setValue('');
    this.registerFormU.controls['PE_DIRECCION'].setValue('');
    this.registerFormU.controls['PE_TELEFONO1'].setValue('');
    this.registerFormU.controls['PE_FAX'].setValue('');
    this.registerFormU.controls['PE_CIUDADNAC'].setValue('07');
    this.registerFormU.controls['PE_EMAIL'].setValue('');
    this.registerFormU.controls['PE_ESTADO'].setValue(true);
    this.registerFormU.controls['PE_IDENTIFICACION'].setValue('RUC');
    this.registerFormU.controls['PE_FPAGO'].setValue('CONTADO');
    this.registerFormU.controls['PE_PLAZO'].setValue('0');
    this.registerFormU.controls['PE_TIPOC'].setValue(true);
    this.registerFormU.controls['PE_TIPOP'].setValue(false);
    this.registerFormU.controls['PE_TIPOT'].setValue(false);
    this.registerFormU.controls['PE_TIPOO'].setValue(false);

  }

  //cancelar form
  cancelarform() {
    localStorage.removeItem('idPerson');
    localStorage.removeItem('tipoPantalla');
    localStorage.removeItem('idPerson');
    this._location.back();
    // this.router.navigate(['/dashboard/inventarios/']);
  }

  llenarForm(id:string){
    let emailsArr = [];
    this.mostrarform('2');
    this.subscription.add(
      this.personaSvc.obtenerIdPersona(id).subscribe((res: any) => {
        this.emails = [];
        if (res['PE_EMAIL']){
          if (res['PE_EMAIL'].length>0){
              emailsArr = res['PE_EMAIL'].split(';');
              for (let email of emailsArr){
                this.emails.push({name: email, invalid: false});
              }
          }
        }
        this.registerFormU.setValue({
          PE_CODCIA:    res['PE_CODCIA'],
          PE_CEDULA:    res['PE_CEDULA'],
          PE_NOMBRE:    res['PE_NOMBRE'],
          PE_APELLIDO:  res['PE_APELLIDO'],
          PE_DIRECCION: res['PE_DIRECCION'],
          PE_TELEFONO1: res['PE_TELEFONO1'],
          PE_FAX:       res['PE_FAX'],
          PE_CIUDADNAC: res['PE_CIUDADNAC'],
          PE_EMAIL:     '',
          PE_ESTADO:    res['PE_ESTADO'] == 'AC' ? true : false,
          PE_IDENTIFICACION: res['PE_IDENTIFICACION'] == 'R' ? 'RUC' : res['PE_IDENTIFICACION'] == 'C' ? 'CEDULA' : 'PASAPORTE',
          PE_FPAGO:res['PE_FPAGO'] === 'C' ? 'CONTADO' : 'CREDITO',
          PE_PLAZO:res['PE_PLAZO'],
          PE_TIPOC:res['PE_TIPOCLI'].substring(0,1) == '1' ? true : false,
          PE_TIPOP:res['PE_TIPOCLI'].substring(1,2) == '1' ? true : false,
          PE_TIPOT:res['PE_TIPOCLI'].substring(2,3) == '1' ? true : false,
          PE_TIPOO:res['PE_TIPOCLI'].substring(3,4) == '1' ? true : false,

        });

        localStorage.setItem('idPerson', res['PE_CODIGO']);

      },(err)=>{
          
        Swal.fire('Error', err.error.message, 'error');
        this.cancelarform();

    })
    );
  }

  obtenerIdentificacionPersona(id:string){

    this.subscription.add(
      this.personaSvc.obtenerIdentificacionPersona(id).subscribe((res) => {
        
        if (JSON.parse(JSON.stringify(res)).estado === '1'){
          
        }else{

          Swal.fire({
            icon: 'info',
            title: 'Informativo',
            html: JSON.parse(JSON.stringify(res)).message + '<br><br> TIPO : ' + JSON.parse(JSON.stringify(res)).data.PE_IDENTIFICACION + 
                                            '<br> IDENTIFICACION: ' + JSON.parse(JSON.stringify(res)).data.PE_CEDULA + 
                                            '<br> NOMBRES : ' + JSON.parse(JSON.stringify(res)).data.PE_NOMBRE+
                                            '<br> ESTADO : ' + JSON.parse(JSON.stringify(res)).data.PE_ESTADO,
            
          })
        }

      })
    );
  }

}

//OBJETIVO: Validar que el dígito verificador de la cédula esté correcto
function verificadorCedula(identifica: string){
  //var identifica = document.getElementById("identifica").value;
  let lnResultado=0;
  let lnValor=0;
  let lnDigito=0;
  let lnTotal=0;
  let lnColumna = 1;
  let lcCadena1 = "";
  
  while (lnColumna < 10){
      lnResultado = lnColumna % 2;
      if (lnResultado == 0){
          lcCadena1 = lcCadena1.trim() + identifica.charAt(lnColumna-1);
      }else{
          lcCadena1 = lcCadena1.trim() + (parseInt(identifica.charAt(lnColumna-1)) * 2).toString();
      }
      lnColumna +=  1;
  }

  lnValor = 0;
  lnColumna = 1;
  while (lcCadena1.length >= lnColumna){
      lnValor = lnValor + parseInt(lcCadena1.charAt(lnColumna-1));
      lnColumna += 1;
  }
  
  lnDigito = 0;
  lnTotal = lnValor;

  while (lnResultado !== 0){
      lnResultado = lnTotal % 10
      if (lnResultado == 0 ){
          lnDigito = lnTotal - lnValor
      }else{
          lnTotal = lnTotal + 1
      }
  }

  if (lnDigito == parseInt(identifica.charAt(9))){
      return true;
  }else{
      return false;
  }
}

// OBJETIVO: Validar que el dígito verificador del RUC esté correcto
// Este procedimiento ha sido creado en base a lo especificado por la SRI
function verificadorRuc(identifica: string){
  let lcBase="";
  let lnAcum=0;
  let lnCont=0;
  let lnResiduo=0;

  let lcIdentificacion = identifica.trim();
  if (identifica.substring(10, 13) == "000"){
      return false;
  }
  var op = parseInt(identifica.charAt(2), 16);

  if (op==9) {
      //Para el caso de que el tercer dígito sea 9
      //Los tres últimos dígitos del Ruc no pueden ser ceros
      if (parseInt(identifica.substring(10, 13)) == 0){
          return false;
      }
      // Realiza los cálculos para el módulo 11
      lcBase = "432765432";
      lnAcum = 0;
      for (lnCont = 1; lnCont <= 9; lnCont++){
          lnAcum = lnAcum + parseInt(lcIdentificacion.charAt(lnCont-1)) * parseInt(lcBase.charAt(lnCont-1));
      }
      lnResiduo = lnAcum % 11;

      if (lnResiduo !== 0){
          lnResiduo = 11 - lnResiduo;
      }
      // Comparar el decimo digito contra el residuo

     if (parseInt(identifica.charAt(9)) == lnResiduo){
          return true;
     }else{
          return false;
     }
  }else if (op == 6 || op == 8){
      //Para el caso de que el tercer dígito sea 6 u 8
      // Los cuatro últimos dígitos del Ruc no pueden ser ceros
      if (parseInt(identifica.substring(10, 13)) == 0){
          return false;
      }
      // Realiza los cálculos para el módulo 11
      lcBase = "32765432";
      lnAcum = 0;
      for (lnCont = 1; lnCont<=8;lnCont++){
          lnAcum = lnAcum + parseInt(lcIdentificacion.charAt(lnCont)) * parseInt(lcBase.charAt(lnCont));
      }
      lnResiduo = lnAcum % 11;
      if (lnResiduo !== 0) {
          lnResiduo = 11 - lnResiduo;
      }
      // Comparar el decimo digito contra el residuo
      if (parseInt(lcIdentificacion.charAt(9)) == lnResiduo){
          return true;
      }else{
          return false;
      }
  }else if (op < 6){
      if (verificadorCedula(lcIdentificacion.substring(0, 10))){
          if (lcIdentificacion.length !== 13){
              return false;
          }else{
              return true;
          }
      }else{
          return false;
      }
  }else{
      //De lo contrario el módulo debe retornar un valor de falso
      return false;
  }

}
