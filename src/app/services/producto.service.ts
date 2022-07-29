import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { ProductoForm } from '../interfaces/producto-Form.interface';

//http://localhost:3000
const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http:HttpClient) { }

  newProducto(formData:any, imgProducto: File) {
    let datos = new FormData();

    datos.append("AR_CODCIA",formData.AR_CODCIA);
    datos.append("AR_CODKEY",formData.AR_CODKEY);
    datos.append("AR_CODIGO",formData.AR_CODIGO);
    datos.append("AR_DESCRIPCION",formData.AR_DESCRIPCION);
    datos.append("AR_ESPECIFICA",formData.AR_ESPECIFICA);
    datos.append("AR_AFECSTOCK",formData.AR_AFECSTOCK);
    datos.append("AR_IMAGEN1",imgProducto);
    datos.append("AR_IVA",formData.AR_IVA);
    datos.append("AR_CSTOCK",formData.AR_CSTOCK);
    datos.append("AR_ESTADO",formData.AR_ESTADO);
    datos.append("AR_PRECIODIS_DOLAR",formData.AR_PRECIODIS_DOLAR);
    datos.append("AR_PORPREDIS",formData.AR_PORPREDIS);
    datos.append("AR_COSTO_DOLAR",formData.AR_COSTO_DOLAR);
    datos.append("AR_COSTOFAC",formData.AR_COSTOFAC);
    // console.log(datos)
    return this.http.post(`${URL}/products`, datos, {responseType: 'text'});

  }

  get token():string{
    return localStorage.getItem('token')!;
  }

  obtenerProductos(){

    let headers  = new HttpHeaders({
      'token':  localStorage.getItem('token') || '{}'
    });

    return this.http.get<ProductoForm[]>(`${URL}/products`,{headers});

  }

  obtenerIdentificacionProducto(id:string,aux:string){
  
    let headers = new HttpHeaders({
      'token': this.token
    });

    return this.http.get(`${URL}/products/${id}/${aux}/i`,{headers});

  }

  deleteProducto(id:string, nomImgProduct:string){

    let headers = new HttpHeaders({
      'token': this.token
    });

    return this.http.delete(`${URL}/products/${id}/${nomImgProduct}`, {headers}); 

  }

  obtenerIdProducto(id:string){
  
    let headers = new HttpHeaders({
      'token': this.token
    });

    return this.http.get(`${URL}/products/${id}/''/c`,{headers});

  }

  editarProducto(id:string, nomImgProduct:string, imgProducto: File, formData:any){
    let headers = new HttpHeaders({
      'token': this.token
    });

    let datos = new FormData();

    datos.append("AR_CODCIA",formData.AR_CODCIA);
    datos.append("AR_CODKEY",formData.AR_CODKEY);
    datos.append("AR_CODIGO",formData.AR_CODIGO);
    datos.append("AR_DESCRIPCION",formData.AR_DESCRIPCION);
    datos.append("AR_ESPECIFICA",formData.AR_ESPECIFICA);
    datos.append("AR_AFECSTOCK",formData.AR_AFECSTOCK);
    datos.append("AR_IMAGEN1",imgProducto);
    datos.append("AR_IVA",formData.AR_IVA);
    datos.append("AR_CSTOCK",formData.AR_CSTOCK);
    datos.append("AR_ESTADO",formData.AR_ESTADO);
    datos.append("AR_PRECIODIS_DOLAR",formData.AR_PRECIODIS_DOLAR);
    datos.append("AR_PORPREDIS",formData.AR_PORPREDIS);
    datos.append("AR_COSTO_DOLAR",formData.AR_COSTO_DOLAR);
    datos.append("AR_COSTOFAC",formData.AR_COSTOFAC);

    return this.http.put(`${URL}/products/${id}/${nomImgProduct}`, datos, {headers});

  }

}
