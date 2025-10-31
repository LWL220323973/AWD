import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCheckboxModule, NzCheckboxOption } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpaceModule } from 'ng-zorro-antd/space';

interface LanguageOption {
  value: string;
  label: string;
}

interface districtOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    NzLayoutModule,
    NzIconModule,
    NzSelectModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzTimePickerModule,
    NzGridModule,
    NzCheckboxModule,
    NzButtonModule,
    NzTableModule,
    NzSpaceModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})

export class App implements OnInit {
  selectedLanguage: string = 'en-US';
  translations: any = {};
  isLoading: boolean = true;

  // Form control properties
  location: string = '';
  selectedDistrict: string = '';
  address: string = '';
  openHour: Date | null = null;
  closingHour: Date | null = null;
  selectedWeekdays: string[] = [];

  languageOptions: LanguageOption[] = [
    { value: 'en-US', label: 'English' },
    { value: 'zh-TW', label: '繁體中文' },
    { value: 'zh-CN', label: '简体中文' },
  ];

  districtOptions: districtOption[] = [];
  weekdayOptions: NzCheckboxOption[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadLanguage(this.selectedLanguage);
  }

  // Load language JSON file
  loadLanguage(language: string): void {
    this.isLoading = true;
    const languageFile = `/language/${language}.json`;

    this.http.get(languageFile).subscribe({
      next: (data) => {
        this.translations = data;
        this.updateOptions(); // Update dropdown options after loading translations
        this.isLoading = false;
        console.log(`Language ${language} loaded successfully`);
      },
      error: (error) => {
        console.error(`Failed to load language file: ${languageFile}`, error);
        this.isLoading = false;
        // Fallback to default translations
        this.translations = {
          title: 'Mobile Post Office',
          welcome: 'Welcome',
          description: 'Mobile Post Office System',
          footer: 'AWD ©2025 Created by 257025507',
        };
        this.updateOptions(); // Update options even with fallback translations
      },
    });
  }

  // Language change handler
  onLanguageChange(language: string): void {
    this.selectedLanguage = language;
    console.log('Language changed to:', language);
    this.loadLanguage(language);
  }

  // Update options after language loading
  updateOptions(): void {
    this.districtOptions = [
      { value: 'Central & Western', label: this.getTranslation('Central & Western') },
      { value: 'Wan Chai', label: this.getTranslation('Wan Chai') },
      { value: 'Eastern', label: this.getTranslation('Eastern') },
      { value: 'Southern', label: this.getTranslation('Southern') },
      { value: 'Yau Tsim Mong', label: this.getTranslation('Yau Tsim Mong') },
      { value: 'Sham Shui Po', label: this.getTranslation('Sham Shui Po') },
      { value: 'Kowloon City', label: this.getTranslation('Kowloon City') },
      { value: 'Wong Tai Sin', label: this.getTranslation('Wong Tai Sin') },
      { value: 'Kwun Tong', label: this.getTranslation('Kwun Tong') },
      { value: 'Tsuen Wan', label: this.getTranslation('Tsuen Wan') },
      { value: 'Tuen Mun', label: this.getTranslation('Tuen Mun') },
      { value: 'Yuen Long', label: this.getTranslation('Yuen Long') },
      { value: 'North', label: this.getTranslation('North') },
      { value: 'Tai Po', label: this.getTranslation('Tai Po') },
      { value: 'Sha Tin', label: this.getTranslation('Sha Tin') },
      { value: 'Sai Kung', label: this.getTranslation('Sai Kung') },
      { value: 'Kwai Tsing', label: this.getTranslation('Kwai Tsing') },
      { value: 'Islands District', label: this.getTranslation('Islands District') },
    ];

    this.weekdayOptions = [
      { label: this.getTranslation('Monday'), value: '1' },
      { label: this.getTranslation('Tuesday'), value: '2' },
      { label: this.getTranslation('Wednesday'), value: '3' },
      { label: this.getTranslation('Thursday'), value: '4' },
      { label: this.getTranslation('Friday'), value: '5' },
    ];
  }

  // Helper method to get translation
  getTranslation(key: string): string {
    return this.translations[key] || key;
  }

  // Reset form handler
  onReset(): void {
    this.location = '';
    this.selectedDistrict = '';
    this.address = '';
    this.openHour = null;
    this.closingHour = null;
    this.selectedWeekdays = [];
    console.log('Form has been reset');
  }

  clearLocation(): void {
    this.location = '';
  }

  clearAddress(): void {
    this.address = '';
  }
}
