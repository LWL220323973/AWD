import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { LanguageService } from '../../services/languageService';
@Component({
  selector: 'router-outlet',
  imports: [CommonModule, FormsModule, NzSegmentedModule],
  templateUrl: './insert.html',
  styleUrl: './insert.css',
})
export class Insert {
  constructor(private language: LanguageService) {}


  // options = [this.getTranslation('AddOffice'), this.getTranslation('AddOfficeLocation')];

  // Translation method - uses LanguageService
  getTranslation(key: string): string {
    return this.language.getTranslation(key);
  }
}
