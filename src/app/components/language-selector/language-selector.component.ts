import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { LanguageService, Language } from '../../services/language.service';

interface LanguageOption {
  label: string;
  value: Language;
  flag: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  template: `
    <p-dropdown 
      [options]="languages" 
      [(ngModel)]="selectedLanguage"
      (onChange)="onLanguageChange()"
      optionLabel="label"
      [style]="{'width': '150px'}"
      styleClass="language-selector">
      <ng-template pTemplate="selectedItem">
        <div class="flex align-items-center gap-2">
          <img [src]="getSelectedFlag()" class="flag-icon" />
          <span>{{getSelectedLabel()}}</span>
        </div>
      </ng-template>
      <ng-template let-language pTemplate="item">
        <div class="flex align-items-center gap-2">
          <img [src]="language.flag" class="flag-icon" />
          <span>{{language.label}}</span>
        </div>
      </ng-template>
    </p-dropdown>
  `,
  styles: [`
    :host ::ng-deep .language-selector {
      background-color: rgba(255, 255, 255, 0.1);
      border: none;
    }
    
    :host ::ng-deep .p-dropdown-trigger,
    :host ::ng-deep .p-dropdown-label {
      color: white !important;
    }
    
    .flag-icon {
      width: 24px;
      height: 16px;
      object-fit: cover;
    }
  `]
})
export class LanguageSelectorComponent {
  languages: LanguageOption[] = [
    { 
      label: 'Français', 
      value: 'fr',
      flag: 'https://flagcdn.com/w40/fr.png'
    },
    { 
      label: 'العربية', 
      value: 'ar',
      flag: 'https://flagcdn.com/w40/tn.png'
    }
  ];

  selectedLanguage: LanguageOption;

  constructor(private languageService: LanguageService) {
    const currentLang = this.languageService.getCurrentLanguage();
    this.selectedLanguage = this.languages.find(lang => lang.value === currentLang)!;
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage.value);
  }

  getSelectedFlag(): string {
    return this.selectedLanguage.flag;
  }

  getSelectedLabel(): string {
    return this.selectedLanguage.label;
  }
}