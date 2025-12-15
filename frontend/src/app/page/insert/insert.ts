import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { selectMobilePostOfficeName, selectMobilePostOffice } from '../../api/select';
import { insert } from '../../api/insert';
import { deleteMobilePostOffice } from '../../api/delete';
import { updateMobilePostOffice } from '../../api/update';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Subject } from 'rxjs';
import { takeUntil, skip } from 'rxjs/operators';

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
    NzIconModule,
  ],
  templateUrl: './insert.html',
  styleUrl: './insert.css',
})
export class Insert implements OnInit, OnDestroy {
  constructor(
    private language: LanguageService,
    private router: Router,
    private message: NzMessageService
  ) {}

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Initialize options immediately
    this.updateOptions();
    this.getMobilePostOfficeNames();

    // Load edit data if exists
    this.loadEditData();

    // Listen to language changes - skip initial emit to avoid duplicate API calls
    this.language.selectedLanguage$
      .pipe(
        skip(1), // Skip the first initial emit
        takeUntil(this.destroy$)
      )
      .subscribe((language) => {
        this.currentLanguage = language;
        this.updateOptions();
        // Only reload edit data if in edit mode
        if (sessionStorage.getItem('editData')) {
          this.loadEditData();
        }
      });

    // Listen to translation changes - skip initial emit
    this.language.translations
      .pipe(
        skip(1), // Skip the first initial emit
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateOptions();
        // Only reload edit data if in edit mode
        if (sessionStorage.getItem('editData')) {
          this.loadEditData();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEditData(): void {
    const editDataJson = sessionStorage.getItem('editData');
    if (!editDataJson) {
      return;
    }

    this.editData = JSON.parse(editDataJson);

    selectMobilePostOffice({ address: this.editData.address_en })
      .then((response) => {
        const data = response.data.data;
        if (data && data.length > 0) {
          this.populateFormWithData(data);
        }
      })
      .catch((error) => {
        console.error('Error loading edit data:', error);
      });
  }

  private populateFormWithData(data: any[]): void {
    if (data.length === 0) return;

    const firstItem = data[0];

    // Set location and address fields
    this.location_EN = firstItem?.location_en || '';
    this.address_EN = firstItem?.address_en || '';
    this.location_TW = firstItem?.location_tc || '';
    this.address_TW = firstItem?.address_tc || '';
    this.location_CHS = firstItem?.location_sc || '';
    this.address_CHS = firstItem?.address_sc || '';

    // Set coordinates
    this.latitude = firstItem?.latitude || '';
    this.longitude = firstItem?.longitude || '';

    // Set post office
    this.selectedPostOffice = firstItem?.mobile_code || '';

    // Set district
    this.selectedDistrict =
      this.districtOptions.find((district) => district.value.includes(firstItem?.district_en))
        ?.value || null;

    // Reset all days first
    this.weekdayOptions.forEach((day) => {
      day.open = false;
      day.openHour = null;
      day.closeHour = null;
    });

    // Set weekday hours
    data.forEach((item: any) => {
      const day = this.weekdayOptions.find((d) => d.value === item.day_of_week_code);
      if (day) {
        const openHour = item.open_hour
          ? new Date(2099, 12, 31, item.open_hour.slice(0, 2), item.open_hour.slice(3, 5))
          : null;
        const closeHour = item.close_hour
          ? new Date(2099, 12, 31, item.close_hour.slice(0, 2), item.close_hour.slice(3, 5))
          : null;
        day.open = true;
        day.openHour = openHour;
        day.closeHour = closeHour;
        this.selectedDays.push(day);
        this.beforeSelectedDays.push({
          open: day.open,
          openHour: day.openHour,
          closeHour: day.closeHour,
          value: day.value,
          label: day.label,
          id: item.id,
        });
      }
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

  editData: any = null;
  beforeSelectedDays: any[] = [];
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

  onBack(): void {
    sessionStorage.removeItem('editData');
    this.router.navigate(['/home']);
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
    this.selectedPostOffice ? null : missingFields.push(this.getTranslation('title'));
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
          missingFields.push(`${this.getTranslation('closeHours')} - ${workday.label}`);
        }
      }
    }
    this.latitude.trim() ? null : missingFields.push(this.getTranslation('latitude'));
    this.longitude.trim() ? null : missingFields.push(this.getTranslation('longitude'));

    if (missingFields.length > 0) {
      this.isNzModalVisible = true;
      this.content = missingFields.map((field) => `<p>${field}</p>`).join('');
      return;
    } else {
      const insertData = {
        mobile_code: this.selectedPostOffice,
        location_en: this.location_EN.trim(),
        location_tc: this.location_TW.trim(),
        location_sc: this.location_CHS.trim(),
        address_en: this.address_EN.trim(),
        address_tc: this.address_TW.trim(),
        address_sc: this.address_CHS.trim(),
        district_en: this.selectedDistrict?.[0] || '',
        district_tc: this.selectedDistrict?.[1] || '',
        district_sc: this.selectedDistrict?.[2] || '',
        latitude: this.latitude.trim(),
        longitude: this.longitude.trim(),
        name_tc: '流動郵政局 ' + this.selectedPostOffice,
        name_en: 'Mobile Post Offices ' + this.selectedPostOffice,
        name_sc: '流动邮政局 ' + this.selectedPostOffice,
        day_of_week_code: 0,
        open_hour: '',
        close_hour: '',
      };
      const scAddressChecking = await selectMobilePostOffice({
        address: this.address_CHS.trim(),
      });
      const scLocationChecking = await selectMobilePostOffice({
        location: this.location_CHS.trim(),
      });
      const enAddressChecking = await selectMobilePostOffice({
        address: this.address_EN.trim(),
      });
      const enLocationChecking = await selectMobilePostOffice({
        location: this.location_EN.trim(),
      });
      const tcAddressChecking = await selectMobilePostOffice({
        address: this.address_TW.trim(),
      });
      const tcLocationChecking = await selectMobilePostOffice({
        location: this.location_TW.trim(),
      });
      if (
        scAddressChecking.data.data.length > 0 ||
        scLocationChecking.data.data.length > 0 ||
        enAddressChecking.data.data.length > 0 ||
        enLocationChecking.data.data.length > 0 ||
        tcAddressChecking.data.data.length > 0 ||
        tcLocationChecking.data.data.length > 0
      ) {
        this.message.create('error', this.getTranslation('duplicateEntry'));
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2500);
        return;
      }

      if (sessionStorage.getItem('editData')) {
        const bd = this.beforeSelectedDays.filter((day) => day.open);
        const cd = this.selectedDays.filter((day) => day.open);
        this.weekdayOptions.forEach((day) => {
          const beforeDay = bd.find((d) => d.value === day.value)
            ? bd.find((d) => d.value === day.value)
            : null;
          const currentDay = cd.find((d) => d.value === day.value)
            ? cd.find((d) => d.value === day.value)
            : null;
          if (beforeDay == null && currentDay != null) {
            insertData.day_of_week_code = currentDay.value;
            insertData.open_hour = currentDay.openHour
              ? currentDay.openHour.toTimeString().slice(0, 5)
              : '';
            insertData.close_hour = currentDay.closeHour
              ? currentDay.closeHour.toTimeString().slice(0, 5)
              : '';
            insert(insertData)
              .then((response) => {
                console.log('Insert successful:', response.data);
              })
              .catch((error) => {
                console.error('Insert failed:', error);
              });
          } else if (beforeDay != null && currentDay == null) {
            deleteMobilePostOffice(beforeDay.id)
              .then((response) => {
                console.log('Delete successful:', response.data);
              })
              .catch((error) => {
                console.error('Delete failed:', error);
              });
          } else if (beforeDay != null && currentDay != null) {
            insertData.day_of_week_code = currentDay.value;
            insertData.open_hour = currentDay.openHour
              ? currentDay.openHour.toTimeString().slice(0, 5)
              : '';
            insertData.close_hour = currentDay.closeHour
              ? currentDay.closeHour.toTimeString().slice(0, 5)
              : '';
            updateMobilePostOffice(beforeDay.id, insertData)
              .then((response) => {
                console.log('Update successful:', response.data);
              })
              .catch((error) => {
                console.error('Update failed:', error);
              });
          }
        });
        this.message.create('success', this.getTranslation('updateSuccess'));
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2500);
      } else {
        for (let day of this.selectedDays) {
          insertData.day_of_week_code = day.value;
          insertData.open_hour = day.openHour ? day.openHour.toTimeString().slice(0, 5) : '';
          insertData.close_hour = day.closeHour ? day.closeHour.toTimeString().slice(0, 5) : '';
          insert(insertData)
            .then((response) => {
              console.log('Insert successful:', response.data);
            })
            .catch((error) => {
              console.error('Insert failed:', error);
            });
          this.message.create('success', this.getTranslation('insertSuccess'));
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2500);
        }
      }
    }
  }

  getMobilePostOfficeNames(): void {
    selectMobilePostOfficeName().then((data) => {
      this.postOfficeNames = data.data.data; // Assuming the actual data is in the 'data' property
      // console.log('Fetched mobile post office names:', this.postOfficeNames);
    });
  }

  handleCancel(): void {
    this.isNzModalVisible = false;
  }
}
