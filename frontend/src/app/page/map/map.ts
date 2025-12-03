import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/languageService';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GoogleMapsModule } from '@angular/google-maps';
import { Router } from '@angular/router';
@Component({
  selector: 'router-outlet',
  templateUrl: './map.html',
  imports: [NzButtonModule, GoogleMapsModule, NzIconModule],
  styleUrl: './map.css',
})
export class Map implements OnInit {
  constructor(private language: LanguageService, private router: Router) {}

  ngOnInit(): void {
    this.latitude = parseFloat(sessionStorage.getItem('mapLatitude') || '0');
    this.longitude = parseFloat(sessionStorage.getItem('mapLongitude') || '0');
    this.center = { lat: this.latitude, lng: this.longitude };
    console.log('Map coordinates:', this.latitude, this.longitude);
  }

  getTranslation(key: string): string {
    return this.language.getTranslation(key);
  }

  latitude: number = 0;
  longitude: number = 0;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
