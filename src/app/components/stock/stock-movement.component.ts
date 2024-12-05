import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { StockMovement, MovementType, MovementSource } from '../../models/stock-movement.model';
import { StockItem } from '../../models/stock-item.model';
import { StockMovementService } from '../../services/api/stock-movement.service';
import { StockItemService } from '../../services/api/stock-item.service';
import { FR } from '../../i18n/fr';

@Component({
  selector: 'app-stock-movement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule,
    TooltipModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="card">
      <div class="flex justify-content-between align-items-center mb-4">
        <h2 class="text-2xl font-semibold text-primary m-0">
          <i class="pi pi-history mr-2"></i>{{i18n.stockMovement.title}}
        </h2>
        <button pButton [label]="i18n.stockMovement.addMovement" 
                icon="pi pi-plus" 
                (click)="showDialog()"></button>
      </div>

      <p-table [value]="movements" 
               [lazy]="true"
               (onLazyLoad)="loadMovements($event)"
               [paginator]="true" 
               [rows]="5"
               [totalRecords]="totalRecords"
               [loading]="loading"
               [showCurrentPageReport]="true"
               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
               [rowsPerPageOptions]="[5,10,25,50]"
               styleClass="p-datatable-gridlines">
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="date">{{i18n.common.date}} <p-sortIcon field="date"></p-sortIcon></th>
            <th pSortableColumn="stockItemName">{{i18n.stockMovement.item}} <p-sortIcon field="stockItemName"></p-sortIcon></th>
            <th pSortableColumn="type">{{i18n.stockMovement.type}} <p-sortIcon field="type"></p-sortIcon></th>
            <th pSortableColumn="source">{{i18n.stockMovement.source}} <p-sortIcon field="source"></p-sortIcon></th>
            <th pSortableColumn="quantity">{{i18n.stockMovement.quantity}} <p-sortIcon field="quantity"></p-sortIcon></th>
            <th pSortableColumn="unitPrice">{{i18n.stockMovement.unitPrice}} <p-sortIcon field="unitPrice"></p-sortIcon></th>
            <th pSortableColumn="totalPrice">{{i18n.stockMovement.totalPrice}} <p-sortIcon field="totalPrice"></p-sortIcon></th>
            <th>{{i18n.stockMovement.reference}}</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-movement>
          <tr>
            <td>{{movement.date | date:'dd/MM/yyyy HH:mm'}}</td>
            <td>{{movement.stockItemName}}</td>
            <td>
              <span [class]="movement.type === 'IN' ? 'badge-success' : 'badge-warning'">
                {{movement.type === 'IN' ? i18n.stockMovement.in : i18n.stockMovement.out}}
              </span>
            </td>
            <td>{{movement.source}}</td>
            <td>{{movement.quantity}}</td>
            <td>{{movement.unitPrice | currency:'TND'}}</td>
            <td>{{movement.totalPrice | currency:'TND'}}</td>
            <td>{{movement.reference}}</td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="8" class="text-center p-4">{{i18n.maintenance.noRecords}}</td>
          </tr>
        </ng-template>
      </p-table>

      <p-dialog [header]="i18n.stockMovement.addMovement"
                [(visible)]="displayDialog"
                [modal]="true"
                [style]="{width: '500px'}"
                styleClass="p-fluid">
        <div class="flex flex-column gap-3 pt-3">
          <div class="field">
            <label for="item" class="font-medium">{{i18n.stockMovement.item}}</label>
            <p-dropdown id="item"
                       [options]="stockItems"
                       [(ngModel)]="newMovement.stockItemId"
                       optionLabel="name"
                       optionValue="id"
                       (onChange)="onItemChange($event)"
                       [placeholder]="i18n.stockMovement.selectItem"
                       class="w-full"></p-dropdown>
          </div>

          <div class="field">
            <label for="type" class="font-medium">{{i18n.stockMovement.type}}</label>
            <p-dropdown id="type"
                       [options]="movementTypes"
                       [(ngModel)]="newMovement.type"
                       [placeholder]="i18n.stockMovement.selectType"
                       class="w-full"></p-dropdown>
          </div>

          <div class="field">
            <label for="source" class="font-medium">{{i18n.stockMovement.source}}</label>
            <p-dropdown id="source"
                       [options]="movementSources"
                       [(ngModel)]="newMovement.source"
                       [placeholder]="i18n.stockMovement.selectSource"
                       class="w-full"></p-dropdown>
          </div>

          <div class="field">
            <label for="quantity" class="font-medium">{{i18n.stockMovement.quantity}}</label>
            <p-inputNumber id="quantity"
                          [(ngModel)]="newMovement.quantity"
                          [min]="1"
                          (onInput)="calculateTotal()"
                          class="w-full"></p-inputNumber>
          </div>

          <div class="field">
            <label for="reference" class="font-medium">{{i18n.stockMovement.reference}}</label>
            <input pInputText id="reference"
                   [(ngModel)]="newMovement.reference"
                   class="w-full" />
          </div>

          <div class="field">
            <label for="notes" class="font-medium">{{i18n.stockMovement.notes}}</label>
            <textarea pInputTextarea id="notes"
                      [(ngModel)]="newMovement.notes"
                      [rows]="3"
                      class="w-full"></textarea>
          </div>

          <div class="field" *ngIf="selectedStockItem">
            <div class="flex justify-content-between">
              <span>{{i18n.stock.currentQuantity}}: {{selectedStockItem.currentQuantity}}</span>
              <span>{{i18n.stock.minQuantity}}: {{selectedStockItem.minQuantity}}</span>
            </div>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <button pButton [label]="i18n.common.cancel"
                  (click)="hideDialog()"
                  class="p-button-text"></button>
          <button pButton [label]="i18n.common.save"
                  (click)="saveMovement()"
                  [disabled]="!isValidMovement()"></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .badge-success {
      background-color: var(--green-500);
      color: white;
    }
    
    .badge-warning {
      background-color: var(--yellow-500);
      color: white;
    }
  `]
})
export class StockMovementComponent implements OnInit {
  movements: StockMovement[] = [];
  stockItems: StockItem[] = [];
  displayDialog = false;
  loading = false;
  totalRecords = 0;
  selectedStockItem: StockItem | null = null;

  movementTypes = [
    { label: 'Entrée', value: MovementType.IN },
    { label: 'Sortie', value: MovementType.OUT }
  ];

  movementSources = Object.values(MovementSource).map(source => ({
    label: source,
    value: source
  }));

  newMovement: StockMovement = this.getEmptyMovement();

  i18n = FR;

  constructor(
    private stockMovementService: StockMovementService,
    private stockItemService: StockItemService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadMovements({ first: 0, rows: 5 });
    this.loadStockItems();
  }

  getEmptyMovement(): StockMovement {
    return {
      id: 0,
      stockItemId: 0,
      stockItemName: '',
      quantity: 1,
      type: MovementType.IN,
      source: MovementSource.PURCHASE,
      date: new Date(),
      unitPrice: 0,
      totalPrice: 0
    };
  }

  loadMovements(event: any) {
    this.loading = true;
    const pageRequest = {
      page: Math.floor(event.first / event.rows),
      size: event.rows,
      sort: event.sortField ? [`${event.sortField},${event.sortOrder === 1 ? 'asc' : 'desc'}`] : undefined
    };
    
    this.stockMovementService.getStockMovements(pageRequest).subscribe({
      next: (response) => {
        this.movements = response.content;
        this.totalRecords = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load stock movements'
        });
        this.loading = false;
      }
    });
  }

  loadStockItems() {
    this.stockItemService.getStockItems({ page: 0, size: 5 }).subscribe({
      next: (response) => {
        this.stockItems = response.content;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load stock items'
        });
      }
    });
  }

  showDialog() {
    this.newMovement = this.getEmptyMovement();
    this.selectedStockItem = null;
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
  }

  onItemChange(event: any) {
    const selectedItem = this.stockItems.find(item => item.id === event.value);
    if (selectedItem) {
      this.selectedStockItem = selectedItem;
      this.newMovement.stockItemName = selectedItem.name;
      this.newMovement.unitPrice = selectedItem.unitPrice;
      this.calculateTotal();
    }
  }

  calculateTotal() {
    if (this.newMovement.quantity && this.newMovement.unitPrice) {
      this.newMovement.totalPrice = this.newMovement.quantity * this.newMovement.unitPrice;
    }
  }

  isValidMovement(): boolean {
    if (!this.selectedStockItem) return false;

    const isValid = !!(
      this.newMovement.stockItemId &&
      this.newMovement.quantity > 0 &&
      this.newMovement.type &&
      this.newMovement.source
    );

    if (this.newMovement.type === MovementType.OUT) {
      return isValid && this.newMovement.quantity <= this.selectedStockItem.currentQuantity;
    }

    return isValid;
  }

  saveMovement() {
    if (this.isValidMovement()) {
      this.stockMovementService.addStockMovement(this.newMovement).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Stock movement added successfully'
          });
          this.loadMovements({ first: 0, rows: 5 });
          this.hideDialog();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add stock movement'
          });
        }
      });
    }
  }
}
