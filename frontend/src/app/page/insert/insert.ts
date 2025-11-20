import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { LanguageService } from '../../services/languageService';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { selectMobilePostOfficeName } from '../../api/select';

interface weekday {
  label: string;
  value: number;
  open: boolean;
  openHour?: Date | null;
  closeHour?: Date | null;
}

interface districtOption {
  label: string;
  value: string[];
}

interface mobilePostOfficeName {
  code:string;
  name_EN: string;
  name_TW: string;
  name_CHS: string;
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
    NzSelectModule,
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
    this.getMobilePostOfficeNames();

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
  districtOptions: districtOption[] = [];
  location_EN: string = '';
  address_EN: string = '';
  location_TW: string = '';
  address_TW: string = '';
  location_CHS: string = '';
  address_CHS: string = '';
  selectedDays: weekday[] = [];
  selectedDistrict: string[] = [];
  postOfficeNames: mobilePostOfficeName[] = [];
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
    this.districtOptions = [
      {
        label: this.getTranslation('Central & Western'),
        value: ['Central and Western', '中西區', '中西区'],
      },
      { label: this.getTranslation('Eastern'), value: ['Eastern', '東區', '东区'] },
      { label: this.getTranslation('Southern'), value: ['Southern', '南區', '南区'] },
      { label: this.getTranslation('Wan Chai'), value: ['Wan Chai', '灣仔區', '湾仔区'] },
      {
        label: this.getTranslation('Kowloon City'),
        value: ['Kowloon City', '九龍城區', '九龙城区'],
      },
      {
        label: this.getTranslation('Kwun Tong'),
        value: ['Kwun Tong', '觀塘區', '观塘区'],
      },
      {
        label: this.getTranslation('Sham Shui Po'),
        value: ['Sham Shui Po', '深水埗區', '深水埗区'],
      },
      {
        label: this.getTranslation('Wong Tai Sin'),
        value: ['Wong Tai Sin', '黃大仙區', '黄大仙区'],
      },
      {
        label: this.getTranslation('Yau Tsim Mong'),
        value: ['Yau Tsim Mong', '油尖旺區', '油尖旺区'],
      },
      { label: this.getTranslation('Kwai Tsing'), value: ['Kwai Tsing', '葵青區', '葵青区'] },
      { label: this.getTranslation('North'), value: ['North', '北區', '北区'] },
      { label: this.getTranslation('Sai Kung'), value: ['Sai Kung', '西貢區', '西贡区'] },
      { label: this.getTranslation('Sha Tin'), value: ['Sha Tin', '沙田區', '沙田区'] },
      { label: this.getTranslation('Tai Po'), value: ['Tai Po', '大埔區', '大埔区'] },
      { label: this.getTranslation('Tsuen Wan'), value: ['Tsuen Wan', '荃灣區', '荃湾区'] },
      { label: this.getTranslation('Tuen Mun'), value: ['Tuen Mun', '屯門區', '屯门区'] },
      { label: this.getTranslation('Yuen Long'), value: ['Yuen Long', '元朗區', '元朗区'] },
      { label: this.getTranslation('Islands'), value: ['Islands', '離島區', '离岛区'] },
    ];
  }

  onWorkdaySelect(day: weekday, isChecked: boolean): void {
    console.log('Checkbox changed:', isChecked);
    day.open = isChecked;
    this.weekdayOptions = this.weekdayOptions.map((d) => (d.value === day.value ? day : d));
    this.selectedDays = this.weekdayOptions.filter((d) => d.open);
  }

  onTimeChange(day: weekday, type: 'open' | 'close', time: Date | null): void {
    if (type === 'open') {
      day.openHour = time;
      console.log('Open hour set to:', time);
    } else {
      day.closeHour = time;
      console.log('Close hour set to:', time);
    }
    this.weekdayOptions = this.weekdayOptions.map((d) => (d.value === day.value ? day : d));
    this.selectedDays = this.weekdayOptions.filter((d) => d.open);
    console.log(`Time changed for ${day.label}:`, day);
  }

  getMobilePostOfficeNames(): void {
    selectMobilePostOfficeName().then((data) => {
      this.postOfficeNames = data.data.data; // Assuming the actual data is in the 'data' property
      console.log('Fetched mobile post office names:', this.postOfficeNames);
    });
  }
}
