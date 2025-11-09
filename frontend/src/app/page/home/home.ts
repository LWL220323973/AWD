import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { LanguageService } from '../../services/languageService';
import {select} from '../../api/select'

interface districtOption {
  value: string;
  label: string;
}

@Component({
  selector: 'router-outlet',
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
    NzTabsModule,
    NzEmptyModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  constructor(private language: LanguageService) {}

  ngOnInit() {
    this.language.selectedLanguage$.subscribe((lang) => {
      console.log('Language changed to:', lang);
      this.updateOptions(); // refresh options on language change
      this.onSubmit();
    });

    //listen to translation changes
    this.language.translations.subscribe((translations) => {
      this.updateOptions();
      this.onSubmit();
    });
  }

  // Form Itemss
  location: string = '';
  selectedDistrict: string = '';
  address: string = '';
  openHour: Date | null = null;
  closingHour: Date | null = null;
  selectedWeekdays: string[] = [];

  //select options
  districtOptions: districtOption[] = [];
  weekdayOptions: any[] = [];
  searchData: any[] = [];

  // Translation method - uses LanguageService
  getTranslation(key: string): string {
    return this.language.getTranslation(key);
  }

  getDayOfWeekData(dayofWeek: number | string) {
    return this.searchData.filter((item: any) => item.day_of_week_code === dayofWeek);
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
    // this.onSubmit();
  }

  clearLocation(): void {
    this.location = '';
  }

  clearAddress(): void {
    this.address = '';
  }

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
      { label: this.getTranslation('Monday'), value: 1 },
      { label: this.getTranslation('Tuesday'), value: 2 },
      { label: this.getTranslation('Wednesday'), value: 3 },
      { label: this.getTranslation('Thursday'), value: 4 },
      { label: this.getTranslation('Friday'), value: 5 },
    ];
  }

  async onSubmit(): Promise<void> {
    const searchItems = {
      location: this.location.trim() ? this.location.trim() : undefined,
      district: this.selectedDistrict.trim() ? this.selectedDistrict.trim() : undefined,
      address: this.address.trim() ? this.address.trim() : undefined,
      openHour: this.openHour ? this.openHour.toTimeString().slice(0, 5) : undefined,
      closingHour: this.closingHour ? this.closingHour.toTimeString().slice(0, 5) : undefined,
      currentLanguage: this.language.currentLanguage,
    };
    console.log('Submitting search with items:', searchItems);
    try {
      const response = await select(searchItems);

      // Extract the actual data array from backend response
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        this.searchData = response.data.data.map((item: any) => {
          return {
            ...item,
            open_hour: item.open_hour.slice(0, 5),
            close_hour: item.close_hour.slice(0, 5),
          };
        });
      } else {
        this.searchData = [];
        console.error('Invalid response format or no data received');
      }
      console.log('Final search data:', this.searchData);
    } catch (error) {
      console.error('Search failed:', error);
      this.searchData = [];
    }
  }
}
