import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../../services/languageService';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';

interface LanguageOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-root',
  imports: [NzLayoutModule, NzSelectModule, RouterOutlet, CommonModule, FormsModule, NzIconModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  selectedLanguage: string = 'en-US';
  translations: any = {};
  isLoading: boolean = true;
  constructor(private http: HttpClient, private languageService: LanguageService) {}

  languageOptions: LanguageOption[] = [
    { value: 'en-US', label: 'English' },
    { value: 'zh-TW', label: '繁體中文' },
    { value: 'zh-CN', label: '简体中文' },
  ];

  ngOnInit(): void {
    // Subscribe to language service updates
    this.languageService.selectedLanguage$.subscribe(lang => {
      this.selectedLanguage = lang;
    });
    
    this.languageService.translations.subscribe(translations => {
      this.translations = translations;
    });
    
    this.languageService.isLoading.subscribe(loading => {
      this.isLoading = loading;
    });
  }

  getTranslation(key: string): string {
    return this.languageService.getTranslation(key);
  }

  // Language change handler
  onLanguageChange(language: string): void {
    this.languageService.changeLanguage(language);
  }

}
