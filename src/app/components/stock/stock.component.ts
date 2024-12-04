import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { StockItem } from '../../models/stock-item.model';
import { MockDataService } from '../../services/mock-data.service';
import { FR } from '../../i18n/fr';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DialogModule,
    TooltipModule,
    TagModule
  ],
  template: `
    <div class="card">
      <div class="flex justify-content-between align-items-center mb-4">
        <h2 class="text-2xl font-semibold text-primary m-0">
          <i class="pi pi-box mr-2"></i>{{i18n.stock.title}}
        </h2>
        <button pButton [label]="i18n.stock.addStock" 
                icon="pi pi-plus" 
                (click)="showDialog()"></button>
      </div>

      <p-table 
        #dt
        [value]="stockItems" 
        [lazy]="true"
        [paginator]="true" 
        [rows]="10"
        [totalRecords]="totalRecords"
        [loading]="loading"
        (onLazyLoad)="loadStockItems($event)"
        [showCurrentPageReport]="true"
        [rowsPerPageOptions]="[5,10,25,50]"
        currentPageReportTemplate="Affichage {first} à {last} sur {totalRecords} articles"
        [globalFilterFields]="['name']"
        styleClass="p-datatable-gridlines p-datatable-striped">
        
        <ng-template pTemplate="caption">
          <div class="flex justify-content-between align-items-center">
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <input 
                pInputText 
                type="text" 
                (input)="onGlobalFilter($event)"
                [placeholder]="i18n.common.search"
              />
            </span>
          </div>
        </ng-template>

        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="id">{{i18n.common.id}} <p-sortIcon field="id"></p-sortIcon></th>
            <th pSortableColumn="name">{{i18n.stock.itemName}} <p-sortIcon field="name"></p-sortIcon></th>
            <th pSortableColumn="currentQuantity">{{i18n.stock.currentQuantity}} <p-sortIcon field="currentQuantity"></p-sortIcon></th>
            <th pSortableColumn="minQuantity">{{i18n.stock.minQuantity}} <p-sortIcon field="minQuantity"></p-sortIcon></th>
            <th pSortableColumn="unitPrice">{{i18n.stock.unitPrice}} <p-sortIcon field="unitPrice"></p-sortIcon></th>
            <th pSortableColumn="realPrice">{{i18n.stock.realPrice}} <p-sortIcon field="realPrice"></p-sortIcon></th>
            <th>{{i18n.common.status}}</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-item>
          <tr>
            <td>{{item.id}}</td>
            <td>{{item.name}}</td>
            <td>{{item.currentQuantity}}</td>
            <td>{{item.minQuantity}}</td>
            <td>{{item.unitPrice | currency:'TND'}}</td>
            <td>{{item.realPrice | currency:'TND'}}</td>
            <td>
              <p-tag 
                [severity]="item.currentQuantity < item.minQuantity ? 'danger' : 'success'"
                [value]="item.currentQuantity < item.minQuantity ? i18n.stock.lowStock : i18n.stock.inStock">
              </p-tag>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="7" class="text-center p-4">{{i18n.maintenance.noRecords}}</td>
          </tr>
        </ng-template>
      </p-table>

      <p-dialog 
        [header]="i18n.stock.addStock" 
        [(visible)]="displayDialog"
        [style]="{width: '500px'}" 
        [modal]="true"
        styleClass="p-fluid">
        
        <div class="flex flex-column gap-3 pt-3">
          <div class="field">
            <label for="name" class="font-medium">{{i18n.stock.itemName}}</label>
            <input pInputText id="name" 
                   [(ngModel)]="newItem.name"
                   [placeholder]="i18n.stock.itemName"
                   class="w-full" />
          </div>

          <div class="field">
            <label for="currentQuantity" class="font-medium">{{i18n.stock.currentQuantity}}</label>
            <p-inputNumber id="currentQuantity" 
                          [(ngModel)]="newItem.currentQuantity"
                          [min]="0"
                          [placeholder]="i18n.stock.currentQuantity"
                          class="w-full"></p-inputNumber>
          </div>

          <div class="field">
            <label for="minQuantity" class="font-medium">{{i18n.stock.minQuantity}}</label>
            <p-inputNumber id="minQuantity" 
                          [(ngModel)]="newItem.minQuantity"
                          [min]="0"
                          [placeholder]="i18n.stock.minQuantity"
                          class="w-full"></p-inputNumber>
          </div>

          <div class="field">
            <label for="unitPrice" class="font-medium">{{i18n.stock.unitPrice}}</label>
            <p-inputNumber id="unitPrice" 
                          [(ngModel)]="newItem.unitPrice"
                          mode="currency" 
                          currency="EUR"
                          [min]="0"
                          [placeholder]="i18n.stock.unitPrice"
                          class="w-full"></p-inputNumber>
          </div>

          <div class="field">
            <label for="realPrice" class="font-medium">{{i18n.stock.realPrice}}</label>
            <p-inputNumber id="realPrice" 
                          [(ngModel)]="newItem.realPrice"
                          mode="currency" 
                          currency="EUR"
                          [min]="0"
                          [placeholder]="i18n.stock.realPrice"
                          class="w-full"></p-inputNumber>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <button pButton [label]="i18n.common.cancel" 
                  (click)="hideDialog()" 
                  class="p-button-text"></button>
          <button pButton [label]="i18n.common.save" 
                  (click)="saveItem()"
                  [disabled]="!isValidItem()"></button>
        </ng-template>
      </p-dialog>
    </div>
  `
})
export class StockComponent implements OnInit {
  @ViewChild('dt') table!: Table;
  
  stockItems: StockItem[] = [];
  displayDialog = false;
  loading = false;
  totalRecords = 0;
  
  newItem: StockItem = {
    id: 0,
    name: '',
    currentQuantity: 0,
    minQuantity: 0,
    unitPrice: 0,
    realPrice: 0
  };

  i18n = FR;

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadStockItems({ first: 0, rows: 10 });
  }

  onGlobalFilter(event: Event) {
    const element = event.target as HTMLInputElement;
    this.table.filterGlobal(element.value, 'contains');
  }

  loadStockItems(event: any) {
    this.loading = true;
    
    // Simulate server-side pagination
    this.mockDataService.getStockItems().subscribe(data => {
      const start = event.first;
      const end = start + event.rows;
      
      this.stockItems = data.slice(start, end);
      this.totalRecords = data.length;
      this.loading = false;
    });
  }

  showDialog() {
    this.newItem = {
      id: 0,
      name: '',
      currentQuantity: 0,
      minQuantity: 0,
      unitPrice: 0,
      realPrice: 0
    };
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
  }

  isValidItem(): boolean {
    return !!(
      this.newItem.name &&
      this.newItem.currentQuantity >= 0 &&
      this.newItem.minQuantity >= 0 &&
      this.newItem.unitPrice > 0 &&
      this.newItem.realPrice > 0
    );
  }

  saveItem() {
    if (this.isValidItem()) {
      this.mockDataService.addStockItem(this.newItem).subscribe(() => {
        this.loadStockItems({ first: 0, rows: 10 });
        this.hideDialog();
      });
    }
  }
}