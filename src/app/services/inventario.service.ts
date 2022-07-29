import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { InventarioForm } from '../interfaces/inventario-form.interface';

const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private http:HttpClient) { }

  newInventario(formData:InventarioForm) {
    return this.http.post(`${URL}/inventory`, formData, {responseType: 'text'});

  }

  get token():string{
    return localStorage.getItem('token')!;
  }

  obtenerInventarios(){

    let headers  = new HttpHeaders({
      'token':  localStorage.getItem('token') || '{}'
    });

    return this.http.get<InventarioForm[]>(`${URL}/inventory`,{headers});

  }

  deleteInventario(id:string, editData:InventarioForm){

    let headers = new HttpHeaders({
      'token': this.token
    });

    return this.http.put(`${URL}/inventory/${id}`, editData , {headers}); 

  }

  obtenerIdPInventario(id:string){
  
    let headers = new HttpHeaders({
      'token': this.token
    });

    return this.http.get(`${URL}/inventory/${id}/c`,{headers});

  }

}
