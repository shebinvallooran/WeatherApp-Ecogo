import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  // property declaration
  weatherData: any;
  summary: string = '';
  temperature: number = 0;
  humidity: number = 0;
  windSpeed: any;
  feelsLikeTemp: number = 0;
  minTemp: number = 0;
  maxTemp: number = 0;
  weatherImageUrl: string = '';
  city: string = 'perinthalmanna';
  units: string = 'metric';
  country: string = 'india';

  constructor(private weatherService: WeatherService , private toaster:ToasterService) { }

  ngOnInit(): void {
    this.getCurrentCityWeather();
  }

  getCurrentCityWeather(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.getCityFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
          this.toaster.showWarning("Please ensure you've allowed location permissions")
          this.getWeather();
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.getWeather();
    }
  }

  getCityFromCoordinates(latitude: number, longitude: number): void {
    this.weatherService.getCityFromCoordinates(latitude, longitude).subscribe({
      next: (res: any) => {
        const city = res.results[0].components.city;
        this.city = city;
        this.getWeather();
      },
      error: (error: any) => {
        console.error('Error getting city from coordinates:', error);
        this.getWeather();
      }
    });
  }

  getWeather(): void {
    this.weatherService.getWeather(this.city, this.units).subscribe({
      next: (res: any) => {
        console.log(res);
        this.weatherData = res;
        this.summary = this.weatherData.weather[0].main;
        this.temperature = this.weatherData.main.temp;
        this.humidity = this.weatherData.main.humidity;
        this.windSpeed = this.weatherData.wind.speed;
        this.feelsLikeTemp = this.weatherData.main.feels_like;
        // min and maximum temp
        this.minTemp = this.weatherData.main.temp_min;
        this.maxTemp = this.weatherData.main.temp_max;
        // country
        this.country = this.weatherData.sys.country;
        // url for weather condition image
        this.weatherImageUrl = 'https://openweathermap.org/img/wn/' + this.weatherData.weather[0].icon + '@2x.png';
      },
      error: (error: any) => {
        console.log(error.message)
      if (error.status === 404) {
        this.toaster.showError('City not found. Please enter a valid city name.');
      } else {
        this.toaster.showWarning('An error occurred while fetching weather data.');
      }
    },
      complete: () => console.info('api call completed')
    });
  }
}
