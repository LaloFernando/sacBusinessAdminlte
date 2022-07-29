import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { PersonForm, PersonPlazo, PersonCiudad } from '../interfaces/person-Form.interface';

const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(private http:HttpClient) { }

  newPersona(formData:PersonForm) {
    return this.http.post(`${URL}/persons`, formData, {responseType: 'text'});

  }

  get token():string{
    return localStorage.getItem('token')!;
  }

  obtenerPersonas(){

    let headers  = new HttpHeaders({
      'token':  localStorage.getItem('token') || '{}'
    });

    return this.http.get<PersonForm[]>(`${URL}/persons`,{headers});

  }

  deletePersona(id:string){

    let headers = new HttpHeaders({
      'token': this.token
    });

    return this.http.delete(`${URL}/persons/${id}`, {headers}); 

  }

  obtenerIdPersona(id:string){
  
    let headers = new HttpHeaders({
      'token': this.token
    });

    return this.http.get(`${URL}/persons/${id}/c`,{headers});

  }

  obtenerIdentificacionPersona(id:string){
  
    let headers = new HttpHeaders({
      'token': this.token
    });

    return this.http.get(`${URL}/persons/${id}/i`,{headers});

  }

  editarPersona(id:string, editData:PersonForm){
    let headers = new HttpHeaders({
      'token': this.token
    });

    return this.http.put(`${URL}/persons/${id}`, editData, {headers});

  }

  obtenerPlazos(){
    let headers = new HttpHeaders({
      'token': this.token
    });
    return this.http.get<PersonPlazo[]>(`${URL}/persons/plazos`, {headers});
  }

  obtenerCiudades(){
    let headers = new HttpHeaders({
      'token': this.token
    });
    return this.http.get<PersonCiudad[]>(`${URL}/persons/ciudades`, {headers});
  }
}
