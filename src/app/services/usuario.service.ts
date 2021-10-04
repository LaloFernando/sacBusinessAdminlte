import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-Form.interface';

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
}
