import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { LanguageService } from '../../services/languageService';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

interface weekday {
  label: string;
  value: number;
  open: boolean;
  openHour?: Date | null;
  closeHour?: Date | null;
}

@Component({
  selector: 'router-outlet',
  imports: [
    CommonModule,
    FormsModule,
    NzSegmentedModule,
    NzInputModule,
    NzFormModule,
    NzTimePickerModule,
    NzCheckboxModule,
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
      this.currentLanguage = lang;
      this.updateOptions(); // refresh options on language change
    });

    //listen to translation changes
    this.language.translations.subscribe(async (translations) => {
      this.currentLanguage = translations;
      this.updateOptions();
    });
  }

  currentLanguage: string = '';
  weekdayOptions: weekday[] = [];
  location_EN: string = '';
  address_EN: string = '';
  location_TW: string = '';
  address_TW: string = '';
  location_CHS: string = '';
  address_CHS: string = '';
  selectedDays: weekday[] = [];
  // Translation method - uses LanguageService
  getTranslation(key: string): string {
    return this.language.getTranslation(key);
  }

  updateOptions(): void {
    this.weekdayOptions = [
      {
        label: this.getTranslation('Monday'),
        value: 1,
        open: false,
        openHour: null,
        closeHour: null,
      },
      {
        label: this.getTranslation('Tuesday'),
        value: 2,
        open: false,
        openHour: null,
        closeHour: null,
      },
      {
        label: this.getTranslation('Wednesday'),
        value: 3,
        open: false,
        openHour: null,
        closeHour: null,
      },
      {
        label: this.getTranslation('Thursday'),
        value: 4,
        open: false,
        openHour: null,
        closeHour: null,
      },
      {
        label: this.getTranslation('Friday'),
        value: 5,
        open: false,
        openHour: null,
        closeHour: null,
      },
    ];
  }

  onWorkdaySelect(day: weekday, isChecked: boolean): void {
    console.log('Checkbox changed:', isChecked);
    console.log('Before change:', day);
    day.open = isChecked 
    console.log('After change:', day);
    this.weekdayOptions = this.weekdayOptions.map(d => 
      d.value === day.value ? day : d
    );
    this.selectedDays = this.weekdayOptions.filter(d => d.open);
  }
}
