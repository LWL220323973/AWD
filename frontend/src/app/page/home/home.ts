import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { LanguageService } from '../../services/languageService';
import { selectMobilePostOffice, selectMobilePostOfficeName } from '../../api/select';
import { deleteMobilePostOffice } from '../../api/delete';
import { NzModalModule } from 'ng-zorro-antd/modal';

interface districtOption {
  value: string;
  label: string;
}

interface mobilePostOffice {
  name: string;
  code: string;
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
    NzButtonModule,
    NzTableModule,
    NzSpaceModule,
    NzTabsModule,
    NzEmptyModule,
    NzCollapseModule,
    NzFloatButtonModule,
    NzTooltipModule,
    NzModalModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  constructor(private language: LanguageService, private router: Router) {}

  ngOnInit() {
    this.language.selectedLanguage$.subscribe(async (lang) => {
      console.log('Language changed to:', lang);
      this.currentLanguage = lang;
      this.updateOptions(); // refresh options on language change
      this.onSubmit();
      this.postOfficeNames = await this.mobilePostOfficeName();
    });

    //listen to translation changes
    this.language.translations.subscribe(async (translations) => {
      this.updateOptions();
      this.onSubmit();
      this.postOfficeNames = await this.mobilePostOfficeName();
    });
  }

  // Form Itemss
  location: string = '';
  selectedDistrict: string = '';
  address: string = '';
  openHour: Date | null = null;
  closingHour: Date | null = null;
  selectedWeekdays: string[] = [];

  currentLanguage: string = '';
  //select options
  districtOptions: districtOption[] = [];
  weekdayOptions: any[] = [];

  searchData: any[] = [];
  postOfficeNames: mobilePostOffice[] = [];

  isNzModalVisible: boolean = false;
  selectedDeleteId: number = 0;

  // Translation method - uses LanguageService
  getTranslation(key: string): string {
    return this.language.getTranslation(key);
  }

  getDayOfWeekData(dayofWeek: number | string) {
    return this.searchData.filter((item: any) => item.day_of_week_code === dayofWeek);
  }

  getPostOfficeNamesForDayOfWeek(dayOfWeek: number | string): mobilePostOffice[] {
    // get the mobile_code of the dayOfWeek
    const mobileCodes = this.searchData
      .filter((item: any) => item.day_of_week_code === dayOfWeek)
      .map((item: any) => item.mobile_code);
    return this.postOfficeNames.filter((office) => mobileCodes.includes(office.code));
  }

  getDataForMobileCodeAndDayOfWeek(mobile_code: string, dayOfWeek: number | string) {
    return this.searchData
      .filter((item: any) => item.day_of_week_code === dayOfWeek)
      .filter((item: any) => item.mobile_code === mobile_code);
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

  // Reset form handler
  onReset(): void {
    this.location = '';
    this.selectedDistrict = '';
    this.address = '';
    this.openHour = null;
    this.closingHour = null;
    this.selectedWeekdays = [];
    console.log('Form has been reset');
    this.onSubmit();
  }

  onOpenModal(id: number): void {
    this.isNzModalVisible = true;
    this.selectedDeleteId = id;
  }

  onDelete(id: number): void {
    console.log('Delete button clicked');
    deleteMobilePostOffice(id)
      .then((response) => {
        console.log('Delete successful:', response.data);
        // Refresh the data after deletion
        this.onSubmit();
        this.isNzModalVisible = false;
      })
      .catch((error) => {
        console.error('Delete failed:', error);
      });
  }

  async onSubmit(): Promise<void> {
    const searchItems = {
      location: this.location.trim() ? this.location.trim() : undefined,
      district: this.selectedDistrict.trim() ? this.selectedDistrict.trim() : undefined,
      address: this.address.trim() ? this.address.trim() : undefined,
      openHour: this.openHour ? this.openHour.toTimeString().slice(0, 5) : undefined,
      closingHour: this.closingHour ? this.closingHour.toTimeString().slice(0, 5) : undefined,
    };
    console.log('Submitting search with items:', searchItems);
    try {
      const response = await selectMobilePostOffice(searchItems);

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

  async mobilePostOfficeName(): Promise<any[]> {
    try {
      const response = await selectMobilePostOfficeName();
      if (this.currentLanguage === 'en-US') {
        return response.data.data.map((item: any) => ({
          name: item.name_en,
          code: item.mobile_code,
        }));
      } else if (this.currentLanguage === 'zh-TW') {
        return response.data.data.map((item: any) => ({
          name: item.name_tc,
          code: item.mobile_code,
        }));
      } else {
        return response.data.data.map((item: any) => ({
          name: item.name_sc,
          code: item.mobile_code,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch Mobile Post Office Names:', error);
      return [];
    }
  }

  navigateInsert(): void {
    this.router.navigate(['/insert']);
  }

  handleCancel(): void {
    this.isNzModalVisible = false;
  }
}
