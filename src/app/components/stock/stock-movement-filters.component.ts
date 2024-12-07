import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { StockMovementFilters } from '../../models/stock-filters.model';
import { MovementSource, MovementType } from '../../models/stock-movement.model';
import { LanguageService, Translations } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stock-movement-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, DropdownModule],
  template: `
    <div class="flex flex-wrap gap-3 mb-4">
      <div class="flex-auto">
        <p-calendar [(ngModel)]="filters.startDate"
                   (onSelect)="onFiltersChange()"
                   [showIcon]="true"
                   [placeholder]="i18n.stockMovement.startDate"
                   styleClass="w-full">
        </p-calendar>
      </div>
      <div class="flex-auto">
        <p-calendar [(ngModel)]="filters.endDate"
                   (onSelect)="onFiltersChange()"
                   [showIcon]="true"
                   [placeholder]="i18n.stockMovement.endDate"
                   styleClass="w-full">
        </p-calendar>
      </div>
      <div class="flex-auto">
        <p-dropdown [options]="typeOptions"
                   [(ngModel)]="filters.type"
                   (onChange)="onFiltersChange()"
                   [placeholder]="i18n.stockMovement.filterByType"
                   styleClass="w-full">
        </p-dropdown>
      </div>
      <div class="flex-auto">
        <p-dropdown [options]="sourceOptions"
                   [(ngModel)]="filters.source"
                   (onChange)="onFiltersChange()"
                   [placeholder]="i18n.stockMovement.filterBySource"
                   styleClass="w-full">
        </p-dropdown>
      </div>
    </div>
  `
})
export class StockMovementFiltersComponent implements OnInit, OnDestroy {
  @Input() filters: StockMovementFilters = {};
  @Output() filtersChange = new EventEmitter<StockMovementFilters>();

  typeOptions = [
    { label: '', value: '' },
    { label: '', value: MovementType.IN },
    { label: '', value: MovementType.OUT }
  ];

  sourceOptions = [
    { label: '', value: '' },
    ...Object.values(MovementSource).map(source => ({
      label: '',
      value: source
    }))
  ];

  i18n!: Translations;
  private langSubscription?: Subscription;

  constructor(private languageService: LanguageService) {
    this.i18n = this.languageService.getTranslations();
    this.updateLabels();
  }

  ngOnInit() {
    this.langSubscription = this.languageService.currentLang$.subscribe(() => {
      this.i18n = this.languageService.getTranslations();
      this.updateLabels();
    });
  }

  ngOnDestroy() {
    this.langSubscription?.unsubscribe();
  }

  private updateLabels() {
    this.typeOptions = [
      { label: this.i18n.stock.all, value: '' },
      { label: this.i18n.stockMovement.in, value: MovementType.IN },
      { label: this.i18n.stockMovement.out, value: MovementType.OUT }
    ];

    this.sourceOptions = [
      { label: this.i18n.stock.all, value: '' },
      ...Object.values(MovementSource).map(source => ({
        label: this.i18n.stockMovement.sources[source],
        value: source
      }))
    ];
  }

  onFiltersChange(): void {
    this.filtersChange.emit(this.filters);
  }
}