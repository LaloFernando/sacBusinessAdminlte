import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { RegisterForm } from '../interfaces/register-Form.interface';
import { LoginForm } from '../interfaces/login-Form.interface';
import { tap } from 'rxjs/operators';
import { CambioPassword } from '../interfaces/cambio-password.interface';
import { EditForm } from '../interfaces/edit-form-interface';

//http://localhost:3000
const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient) { }

  newUsuario(formData:RegisterForm) {
    return this.http.post(`${URL}/users`, formData, {responseType: 'text'});

  }

  login(formData: LoginForm){
    return this.http.post(`${URL}/auth/login`, formData).pipe(tap((res:any) => {
      localStorage.setItem('token',res.token);
      localStorage.setItem('serievta',res.datosUsuario[0].US_SERIEVTA);
      localStorage.setItem('nombreUs',res.datosUsuario[0].US_NOMBRE);
    }));
  }

  get token():string{
    return localStorage.getItem('token')!;
  }

  obtenerUsuarios(){

    let headers  = new HttpHeaders({
      'token':  localStorage.getItem('token') || '{}'
    });

    return this.http.get<RegisterForm[]>(`${URL}/users`,{headers});

  }

  deleteUsuario(id:string){

    let headers = new HttpHeaders({
      'token': this.token
    });

    return this.http.delete(`${URL}/users/${id}`, {headers}); 

  }

  cambioPassword(id:string, cambioPass:CambioPassword){

    let headers = new HttpHeaders({
      'token': this.token
    });

    return this.http.put(`${URL}/users/CambiarPassword/${id}`, cambioPass, {headers, responseType:'text'} ); 

  }

  obtenerIdUsuario(id:string){
  
    let headers = new HttpHeaders({
      'token': this.token
    });

    return this.http.get(`${URL}/users/${id}`,{headers});

  }

  editarUsuario(id:string, editData:EditForm){
    let headers = new HttpHeaders({
      'token': this.token
    });

    return this.http.put(`${URL}/users/${id}`, editData, {headers});

  }

}
