import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http:HttpClient) { }
// weather data
  getWeather(city:string ,units:string) {
    return this.http.get('https://api.openweathermap.org/data/2.5/weather?q='+city+'&APPID=2722a0d6e55eccee1189cf00af874a7b&units='+units)
  }
  // weather image data
  getCityFromCoordinates(latitude:number, longitude:number){
    return this.http.get('https://geocode.maps.co/reverse?'+latitude+'=&'+longitude+'=&api_key=663567978269f819303424slm806a6d')
  }
}

