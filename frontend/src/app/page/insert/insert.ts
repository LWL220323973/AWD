import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { LanguageService } from '../../services/languageService';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'router-outlet',
  imports: [
    CommonModule,
    FormsModule,
    NzSegmentedModule,
    NzInputModule,
    NzFormModule,
    NzTimePickerModule,
    NzCheckboxModule
  ],
  templateUrl: './insert.html',
  styleUrl: './insert.css',
})
export class Insert implements OnInit {
  constructor(private language: LanguageService) {}
  // options = [this.getTranslation('AddOffice'), this.getTranslation('AddOfficeLocation')];

  ngOnInit(): void {
    // Initialize options immediately
    this.updateOptions();
    
    this.language.selectedLanguage$.subscribe(async (lang) => {
      console.log('Language changed to:', lang);
      this.updateOptions(); // refresh options on language change
    });

    //listen to translation changes
    this.language.translations.subscribe(async (translations) => {
      this.updateOptions();
    });
  }

  weekdayOptions: any[] = [];

  location_EN: string = '';
  address_EN: string = '';
  location_TW: string = '';
  address_TW: string = '';
  location_CHS: string = '';
  address_CHS: string = '';
  openHour: string = '';
  closingHour: string = '';
  selectedDistrict: string = '';
  workingDays: string[] = [];
  
  // Time slots for each weekday
  dayTimeSlots: { [key: number]: { openTime: Date | null, closeTime: Date | null } } = {
    1: { openTime: null, closeTime: null },
    2: { openTime: null, closeTime: null },
    3: { openTime: null, closeTime: null },
    4: { openTime: null, closeTime: null },
    5: { openTime: null, closeTime: null }
  };
  
  // Translation method - uses LanguageService
  getTranslation(key: string): string {
    return this.language.getTranslation(key);
  }

  updateOptions(): void {
    this.weekdayOptions = [
      { label: this.getTranslation('Monday'), value: 1 },
      { label: this.getTranslation('Tuesday'), value: 2 },
      { label: this.getTranslation('Wednesday'), value: 3 },
      { label: this.getTranslation('Thursday'), value: 4 },
      { label: this.getTranslation('Friday'), value: 5 },
    ];
  }
}
