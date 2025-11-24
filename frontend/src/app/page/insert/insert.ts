import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { LanguageService } from '../../services/languageService';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { selectMobilePostOfficeName } from '../../api/select';
import { insert } from '../../api/insert';
import { NzModalModule } from 'ng-zorro-antd/modal';

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
  mobile_code: string;
  name_tc: string;
  name_en: string;
  name_sc: string;
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
    NzGridModule,
    NzModalModule,
  ],
  templateUrl: './insert.html',
  styleUrl: './insert.css',
})
export class Insert implements OnInit {
  constructor(private language: LanguageService, private router: Router) {}

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
  selectedDistrict: string[] | null = null;
  postOfficeNames: mobilePostOfficeName[] = [];
  selectedPostOffice: string | null = null;
  latitude: string = '';
  longitude: string = '';

  isNzModalVisible: boolean = false;
  content: string = '';
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
    console.log('Checkbox changed:', day.label, isChecked);
    day.open = isChecked;

    // Reset time values when unchecked
    if (!isChecked) {
      day.openHour = null;
      day.closeHour = null;
    }

    // Update the selected days array
    this.selectedDays = this.weekdayOptions.filter((d) => d.open);
    console.log('Selected days:', this.selectedDays);
  }

  onTimeChange(day: weekday, type: 'open' | 'close', time: Date | null): void {
    if (type === 'open') {
      day.openHour = time;
      console.log(`Open hour set for ${day.label}:`, time);
    } else {
      day.closeHour = time;
      console.log(`Close hour set for ${day.label}:`, time);
    }

    console.log(`Updated ${day.label}:`, {
      open: day.open,
      openHour: day.openHour,
      closeHour: day.closeHour,
    });
  }

  onReset(): void {
    this.location_EN = '';
    this.address_EN = '';
    this.location_TW = '';
    this.address_TW = '';
    this.location_CHS = '';
    this.address_CHS = '';
    this.latitude = '';
    this.longitude = '';
    this.selectedPostOffice = null;
    this.selectedDays = [];
    this.selectedDistrict = null;
    this.weekdayOptions.forEach((day) => {
      day.open = false;
      day.openHour = null;
      day.closeHour = null;
    });
    console.log('Form has been reset');
  }

  async onSubmit(): Promise<void> {
    const missingFields: string[] = [];
    this.selectedPostOffice? null : missingFields.push(this.getTranslation('title'));
    this.location_EN.trim() ? null : missingFields.push(this.getTranslation('location(EN)'));
    this.location_TW.trim() ? null : missingFields.push(this.getTranslation('location(TW)'));
    this.location_CHS.trim() ? null : missingFields.push(this.getTranslation('location(CHS)'));
    this.address_EN.trim() ? null : missingFields.push(this.getTranslation('address(EN)'));
    this.address_TW.trim() ? null : missingFields.push(this.getTranslation('address(TW)'));
    this.address_CHS.trim() ? null : missingFields.push(this.getTranslation('address(CHS)'));
    this.selectedDistrict ? null : missingFields.push(this.getTranslation('district'));
    if (this.selectedDays.length == 0) {
      missingFields.push(this.getTranslation('weekdays'));
    } else {
      for (const workday of this.selectedDays) {
        if (!workday.openHour) {
          missingFields.push(`${this.getTranslation('openHours')} - ${workday.label}`);
        }
        if (!workday.closeHour) {
          missingFields.push(`${this.getTranslation('closingHours')} - ${workday.label}`);
        }
      }
    }
    this.latitude.trim() ? null : missingFields.push(this.getTranslation('latitude'));
    this.longitude.trim() ? null : missingFields.push(this.getTranslation('longitude'));

    if (missingFields.length > 0) {
      this.isNzModalVisible = true;
      this.content = missingFields.map(field => `<p>${field}</p>`).join('');
      return;
    }
    const insertData = {};
    insert(insertData)
      .then((response) => {
        console.log('Insert successful:', response.data);
        // Optionally reset the form after successful submission
        this.onReset();
        this.router.navigate(['/insert']);
      })
      .catch((error) => {
        console.error('Insert failed:', error);
      });
  }

  getMobilePostOfficeNames(): void {
    selectMobilePostOfficeName().then((data) => {
      this.postOfficeNames = data.data.data; // Assuming the actual data is in the 'data' property
      console.log('Fetched mobile post office names:', this.postOfficeNames);
    });
  }

  handleCancel(): void {
    this.isNzModalVisible = false;
  }
}
