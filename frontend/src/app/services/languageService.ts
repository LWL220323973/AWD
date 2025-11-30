import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private lang$ = new BehaviorSubject<string>('en-US');
  private translations$ = new BehaviorSubject<any>({});
  private isLoading$ = new BehaviorSubject<boolean>(true);

  selectedLanguage$: Observable<string> = this.lang$.asObservable();
  translations: Observable<any> = this.translations$.asObservable();
  isLoading: Observable<boolean> = this.isLoading$.asObservable();

  constructor(private http: HttpClient) {
    // Initialize with default language
    this.loadLanguage('en-US');
  }

  changeLanguage(lang: string) {
    this.lang$.next(lang);
    this.loadLanguage(lang);
  }

  loadLanguage(language: string): void {
    this.isLoading$.next(true);
    const languageFile = `/language/${language}.json`;

    this.http.get(languageFile).subscribe({
      next: (data) => {
        this.translations$.next(data);
        this.isLoading$.next(false);
        // console.log(`Language ${language} loaded successfully`);
      },
      error: (error) => {
        console.error(`Failed to load language file: ${languageFile}`, error);
        this.isLoading$.next(false);
        // Fallback to default translations
        const fallbackTranslations = {
          title: 'Mobile Post Office',
          welcome: 'Welcome',
          description: 'Mobile Post Office System',
          footer: 'AWD ©2025 Created by 257025507',
          location: 'Location',
          district: 'District',
          address: 'Address',
          officeHours: 'Office Hours',
          clear: 'Clear',
          submit: 'Submit',
          'No data': 'No Data Found',
        };
        this.translations$.next(fallbackTranslations);
      },
    });
  }

  getTranslation(key: string): string {
    const currentTranslations = this.translations$.value;
    return currentTranslations[key] || key;
  }

  get currentLanguage(): string {
    return this.lang$.value;
  }

  get currentTranslations(): any {
    return this.translations$.value;
  }
}
