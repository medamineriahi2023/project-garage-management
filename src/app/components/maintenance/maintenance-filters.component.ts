import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FR } from '../../i18n/fr';

@Component({
  selector: 'app-maintenance-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule],
  template: `
    <div class="flex flex-column gap-2 mb-4">
      <div class="p-input-icon-left w-full">
        <i class="pi pi-search"></i>
        <input 
          type="text" 
          pInputText 
          [placeholder]="i18n.maintenance.searchPlaceholder"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearch($event)"
          class="w-full"
        />
      </div>
    </div>
  `
})
export class MaintenanceFiltersComponent {
  @Output() search = new EventEmitter<string>();
  
  searchTerm: string = '';
  i18n = FR;

  onSearch(term: string) {
    this.search.emit(term);
  }
}