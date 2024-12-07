import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { StockItem } from '../../../models/stock-item.model';
import { LoadingComponent } from '../loading/loading.component';
import { StockItemService } from '../../../services/api/stock-item.service';
import { PageResponse } from '../../../models/pagination.model';

@Component({
  selector: 'app-lazy-multiselect',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MultiSelectModule,
    LoadingComponent
  ],
  template: `
    <p-multiSelect
      [options]="items"
      [(ngModel)]="selectedValue"
      [virtualScroll]="true"
      [virtualScrollItemSize]="43"
      [lazy]="true"
      [filter]="true"
      [showClear]="true"
      [loading]="loading"
      (onLazyLoad)="onLazyLoad($event)"
      (onChange)="onSelectionChange()"
      (onFilter)="onFilter($event)"
      [optionLabel]="optionLabel"
      [placeholder]="placeholder"
      styleClass="w-full"
      [class]="containerClass">
      <ng-template let-item pTemplate="item">
        <div class="flex align-items-center">
          <span>{{item[optionLabel]}}</span>
          <span class="ml-auto text-sm text-gray-500">
            {{item.currentQuantity}} disponible(s)
          </span>
        </div>
      </ng-template>
    </p-multiSelect>
  `,
  styles: [`
    :host ::ng-deep .p-multiselect-panel {
      min-width: 100%;
    }
    
    :host ::ng-deep .p-multiselect-items {
      padding: 0;
    }
    
    :host ::ng-deep .p-multiselect-item {
      padding: 0.75rem 1rem;
      margin: 0;
      border-bottom: 1px solid var(--surface-200);
    }
    
    :host ::ng-deep .p-multiselect-filter-container {
      padding: 0.5rem;
      border-bottom: 1px solid var(--surface-200);
    }
  `]
})
export class LazyMultiselectComponent implements OnInit, OnDestroy {
  @Input() selectedItems: StockItem[] = [];
  @Output() selectedItemsChange = new EventEmitter<StockItem[]>();
  @Input() optionLabel: string = 'name';
  @Input() placeholder: string = 'Select Items';
  @Input() containerClass: string = '';
  @Output() selectionChange = new EventEmitter<StockItem[]>();

  items: StockItem[] = [];
  loading = false;
  private page = 0;
  private readonly pageSize = 20;
  private hasMore = true;
  private filterSubject = new Subject<string>();
  private filterSubscription?: Subscription;
  private currentFilter = '';

  get selectedValue(): StockItem[] {
    return this.selectedItems;
  }

  set selectedValue(value: StockItem[]) {
    this.selectedItems = value;
    this.selectedItemsChange.emit(value);
  }

  constructor(private stockItemService: StockItemService) {}

  ngOnInit() {
    this.setupFilterSubscription();
    this.loadInitialData();
  }

  ngOnDestroy() {
    this.filterSubscription?.unsubscribe();
  }

  private setupFilterSubscription() {
    this.filterSubscription = this.filterSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.page = 0;
      this.items = [];
      this.hasMore = true;
      this.loadData();
    });
  }

  private loadInitialData() {
    this.loading = true;
    this.loadData();
  }

  onLazyLoad(event: any) {
    if (this.hasMore && !this.loading) {
      this.page = Math.floor(this.items.length / this.pageSize);
      this.loadData();
    }
  }

  onFilter(event: { filter: string }) {
    this.currentFilter = event.filter;
    this.filterSubject.next(this.currentFilter);
  }

  private loadData() {

    this.loading = true;
    const pageRequest = {
      page: this.page,
      size: this.pageSize,
      search: this.currentFilter
    };

    this.stockItemService.getEquipment(pageRequest).subscribe({
      next: (response: PageResponse<StockItem>) => {
        const selectedIds = new Set(this.selectedItems?.map(item => item.id));
        const newItems = response.content.filter((item: StockItem) => !selectedIds.has(item.id));
        if (this.page === 0) {
          this.items = [...this.selectedItems, ...newItems];
        } else {
          this.items = [...this.items, ...newItems];
        }

        this.hasMore = !response.last;
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Failed to load equipment:', error);
        this.loading = false;
      }
    });
  }

  onSelectionChange() {
    this.selectionChange.emit(this.selectedValue);
  }
}
