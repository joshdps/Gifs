import { Injectable } from '@angular/core';
import {  HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interfaces/gif.interface';


@Injectable({
  providedIn: 'root'
})
export class GifsService {
  
  private servicioURL = `https://api.giphy.com/v1/gifs`;
  private apiKey    : string ='witX2DQrfbTLmcazCIt6svlC8Q8StJ4y';
  private _historial: string[]=[];

   // To-Do: Cambiar tipado any por el correspondiente
  public resultados: Gif[] = [];

  // Getter para obtener el array  con el historial de busqueda.
  get historial(){
    return [...this._historial]; // se hace de esta forma par romper la relación con la variable privada, de manera que si se modifica el getter, no se afecta la privada ya que los objetos se pasan por referencia
  }

  constructor(private http: HttpClient){
    //if ( localStorage.getItem('historial') ){
      this._historial = JSON.parse(localStorage.getItem('historial')!) || []; 
      this.resultados = JSON.parse(localStorage.getItem('resultado')!) || []; 
  }

  // Metodo para buscar el keyword en el array del historial
  buscarGifs( keyword: string = ''){
    keyword = keyword.trim().toLowerCase();

    if (this._historial.includes(keyword)){
      this._historial = this._historial.filter(elem => elem!==keyword)
    };
      
    this._historial.unshift( keyword );
    this._historial = this._historial.splice(0,10)

    localStorage.setItem('historial', JSON.stringify(this._historial))

      // Definiendo parametros del http request 

    const params = new HttpParams()
          .set('api_key',this.apiKey)
          .set('limit','10') 
          .set('q',keyword)

    // Http request para obtener resultado en Giphy, segun el keyword input
    this.http.get<SearchGifsResponse>(`${this.servicioURL}/search`, { params })
    .subscribe( ( resp ) => {      
      this.resultados = resp.data;
      localStorage.setItem('resultado', JSON.stringify(this.resultados))

    })
  } 

}
