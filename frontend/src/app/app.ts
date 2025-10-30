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
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  selectedLanguage: string = 'en-US';
  translations: any = {};
  isLoading: boolean = true;

  languageOptions: LanguageOption[] = [
    { value: 'en-US', label: 'English' },
    { value: 'zh-TW', label: '繁體中文' },
    { value: 'zh-CN', label: '简体中文' },
  ];

  districtOptions: districtOption[] = [
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
      },
    });
  }

  // Language change handler
  onLanguageChange(language: string): void {
    this.selectedLanguage = language;
    console.log('Language changed to:', language);
    this.loadLanguage(language);
  }

  // Helper method to get translation
  getTranslation(key: string): string {
    return this.translations[key] || key;
  }
}
