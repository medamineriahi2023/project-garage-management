import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { StockFilters } from '../../models/stock-filters.model';
import { LanguageService, Translations } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stock-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  template: `
    <div class="flex gap-3 mb-4">
      <p-dropdown [options]="statusOptions"
                 [(ngModel)]="filters.status"
                 (onChange)="onFiltersChange()"
                 [placeholder]="i18n.stock.filterByStatus"
                 styleClass="w-full md:w-15rem">
      </p-dropdown>
    </div>
  `
})
export class StockFiltersComponent implements OnInit, OnDestroy {
  @Input() filters: StockFilters = { status: 'ALL' };
  @Output() filtersChange = new EventEmitter<StockFilters>();

  statusOptions = [
    { label: '', value: 'ALL' },
    { label: '', value: 'LOW_STOCK' },
    { label: '', value: 'IN_STOCK' }
  ];

  i18n!: Translations;
  private langSubscription?: Subscription;

  constructor(private languageService: LanguageService) {
    this.i18n = this.languageService.getTranslations();
    this.updateStatusOptions();
  }

  ngOnInit() {
    this.langSubscription = this.languageService.currentLang$.subscribe(() => {
      this.i18n = this.languageService.getTranslations();
      this.updateStatusOptions();
    });
  }

  ngOnDestroy() {
    this.langSubscription?.unsubscribe();
  }

  private updateStatusOptions() {
    this.statusOptions = [
      { label: this.i18n.stock.all, value: 'ALL' },
      { label: this.i18n.stock.lowStock, value: 'LOW_STOCK' },
      { label: this.i18n.stock.inStock, value: 'IN_STOCK' }
    ];
  }

  onFiltersChange(): void {
    this.filtersChange.emit(this.filters);
  }
}