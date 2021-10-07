import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { RegisterForm } from '../interfaces/register-Form.interface';
import { LoginForm } from '../interfaces/login-Form.interface';
import { tap } from 'rxjs/operators';

//http://localhost:3000
const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient) { }

  newUsuario(formData:RegisterForm){
    return this.http.post(`${URL}/users`, formData, {responseType: 'text'});
  }

  login(formData: LoginForm){
    return this.http.post(`${URL}/auth/login`, formData).pipe(tap((res:any) => {
      localStorage.setItem('token',res.token);
    }));
  }

  obtenerUsuarios(){

    let headers  = new HttpHeaders({
      'token':  localStorage.getItem('token') || '{}'
    });

    return this.http.get(`${URL}/users`,{headers});

  }

}
