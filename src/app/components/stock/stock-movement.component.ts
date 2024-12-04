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
import { StockMovement, MovementType, MovementSource } from '../../models/stock-movement.model';
import { StockItem } from '../../models/stock-item.model';
import { MockDataService } from '../../services/mock-data.service';
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
    TooltipModule
  ],
  template: `
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
               [paginator]="true" 
               [rows]="10"
               [showCurrentPageReport]="true"
               styleClass="p-datatable-gridlines">
        <ng-template pTemplate="header">
          <tr>
            <th>{{i18n.common.date}}</th>
            <th>{{i18n.stockMovement.item}}</th>
            <th>{{i18n.stockMovement.type}}</th>
            <th>{{i18n.stockMovement.source}}</th>
            <th>{{i18n.stockMovement.quantity}}</th>
            <th>{{i18n.stockMovement.unitPrice}}</th>
            <th>{{i18n.stockMovement.totalPrice}}</th>
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
            <label for="unitPrice" class="font-medium">{{i18n.stockMovement.unitPrice}}</label>
            <p-inputNumber id="unitPrice"
                          [(ngModel)]="newMovement.unitPrice"
                          mode="currency"
                          currency="TND"
                          [min]="0"
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
  `
})
export class StockMovementComponent implements OnInit {
  movements: StockMovement[] = [];
  stockItems: StockItem[] = [];
  displayDialog = false;

  movementTypes = [
    { label: MovementType.IN, value: MovementType.IN },
    { label: MovementType.OUT, value: MovementType.OUT }
  ];

  movementSources = Object.values(MovementSource).map(source => ({
    label: source,
    value: source
  }));

  newMovement: StockMovement = {
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

  i18n = FR;

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.mockDataService.getStockItems().subscribe(items => {
      this.stockItems = items;
    });

    this.mockDataService.getStockMovements().subscribe(movements => {
      this.movements = movements;
    });
  }

  showDialog() {
    this.newMovement = {
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
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
  }

  onItemChange(event: any) {
    const selectedItem = this.stockItems.find(item => item.id === event.value);
    if (selectedItem) {
      this.newMovement.stockItemName = selectedItem.name;
      this.newMovement.unitPrice = selectedItem.unitPrice;
      this.calculateTotal();
    }
  }

  calculateTotal() {
    this.newMovement.totalPrice = this.newMovement.quantity * this.newMovement.unitPrice;
  }

  isValidMovement(): boolean {
    return !!(
      this.newMovement.stockItemId &&
      this.newMovement.quantity > 0 &&
      this.newMovement.unitPrice >= 0 &&
      this.newMovement.type &&
      this.newMovement.source
    );
  }

  saveMovement() {
    if (this.isValidMovement()) {
      this.mockDataService.addStockMovement(this.newMovement).subscribe(() => {
        this.loadData();
        this.hideDialog();
      });
    }
  }
}