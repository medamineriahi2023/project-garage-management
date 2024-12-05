import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MaintenanceFiltersComponent } from './maintenance-filters.component';
import { MaintenanceListComponent } from './maintenance-list.component';
import { Service } from '../../models/service.model';
import { StockItem } from '../../models/stock-item.model';
import { Maintenance } from '../../models/maintenance.model';
import { MaintenanceService } from '../../services/api/maintenance.service';
import { ServiceApiService } from '../../services/api/service.service';
import { StockItemService } from '../../services/api/stock-item.service';
import { PdfService } from '../../services/pdf.service';
import { FR } from '../../i18n/fr';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    MultiSelectModule,
    TooltipModule,
    ToastModule,
    MaintenanceFiltersComponent,
    MaintenanceListComponent
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="card">
      <div class="flex justify-content-between align-items-center mb-4">
        <h2 class="text-2xl font-semibold text-primary m-0">
          <i class="pi pi-wrench mr-2"></i>{{i18n.maintenance.title}}
        </h2>
        <button pButton [label]="i18n.maintenance.addMaintenance" 
                icon="pi pi-plus" 
                (click)="showDialog()"></button>
      </div>

      <app-maintenance-filters (search)="onSearch($event)"></app-maintenance-filters>
      <app-maintenance-list [maintenances]="filteredMaintenances" 
                          (generatePdf)="onGeneratePdf($event)"></app-maintenance-list>

      <p-dialog [header]="i18n.maintenance.addMaintenance" 
                [(visible)]="displayDialog"
                [modal]="true"
                [style]="{width: '500px'}"
                styleClass="p-fluid">
        <div class="flex flex-column gap-3 pt-3">
          <div class="field">
            <label for="clientName" class="font-medium">{{i18n.maintenance.client}}</label>
            <input pInputText id="clientName" 
                   [(ngModel)]="newMaintenance.clientName"
                   [placeholder]="i18n.maintenance.client"
                   class="w-full" />
          </div>

          <div class="field">
            <label for="carRegistration" class="font-medium">{{i18n.maintenance.carRegistration}}</label>
            <input pInputText id="carRegistration" 
                   [(ngModel)]="newMaintenance.carRegistrationNumber"
                   [placeholder]="i18n.maintenance.carRegistration"
                   class="w-full" />
          </div>

          <div class="field">
            <label for="service" class="font-medium">{{i18n.maintenance.service}}</label>
            <p-dropdown id="service"
                       [options]="services"
                       [(ngModel)]="newMaintenance.serviceId"
                       optionLabel="serviceName"
                       optionValue="id"
                       (onChange)="onServiceChange($event)"
                       [placeholder]="i18n.maintenance.service"
                       class="w-full"></p-dropdown>
          </div>

          <div class="field">
            <label for="equipment" class="font-medium">{{i18n.maintenance.equipmentUsed}}</label>
            <p-multiSelect id="equipment"
                          [options]="stockItems"
                          [(ngModel)]="selectedEquipment"
                          optionLabel="name"
                          (onChange)="calculateTotal()"
                          [placeholder]="i18n.maintenance.equipmentUsed"
                          class="w-full"></p-multiSelect>
          </div>

          <div class="field">
            <label for="discount" class="font-medium">{{i18n.maintenance.discount}}</label>
            <p-inputNumber id="discount"
                          [(ngModel)]="newMaintenance.discount"
                          (onInput)="calculateTotal()"
                          mode="currency"
                          currency="TND"
                          [min]="0"
                          [max]="newMaintenance.totalPrice"
                          class="w-full">
            </p-inputNumber>
          </div>

          <div class="flex justify-content-between">
            <div class="field">
              <label class="font-medium">{{i18n.maintenance.subtotal}}</label>
              <div class="text-xl">{{newMaintenance.totalPrice | currency:'TND'}}</div>
            </div>
            <div class="field">
              <label class="font-medium">{{i18n.maintenance.finalPrice}}</label>
              <div class="text-xl font-bold">{{newMaintenance.finalPrice | currency:'TND'}}</div>
            </div>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <button pButton [label]="i18n.common.cancel" 
                  (click)="hideDialog()" 
                  class="p-button-text"></button>
          <button pButton [label]="i18n.common.save" 
                  (click)="saveMaintenance()"
                  [disabled]="!isValidMaintenance()"></button>
        </ng-template>
      </p-dialog>
    </div>
  `
})
export class MaintenanceComponent implements OnInit {
  services: Service[] = [];
  stockItems: StockItem[] = [];
  maintenances: Maintenance[] = [];
  filteredMaintenances: Maintenance[] = [];
  displayDialog = false;
  selectedEquipment: StockItem[] = [];
  loading = false;
  totalRecords = 0;
  
  newMaintenance: Maintenance = this.getEmptyMaintenance();
  i18n = FR;

  constructor(
    private maintenanceService: MaintenanceService,
    private serviceApi: ServiceApiService,
    private stockItemService: StockItemService,
    private pdfService: PdfService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.serviceApi.getServices({ page: 0, size: 1000 }).subscribe({
      next: (response) => {
        this.services = response.content;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load services'
        });
      }
    });

    this.stockItemService.getStockItems({ page: 0, size: 1000 }).subscribe({
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

    this.loadMaintenances({ first: 0, rows: 10 });
  }

  loadMaintenances(event: any) {
    this.loading = true;
    const pageRequest = {
      page: Math.floor(event.first / event.rows),
      size: event.rows,
      sort: event.sortField ? [`${event.sortField},${event.sortOrder === 1 ? 'asc' : 'desc'}`] : undefined
    };

    this.maintenanceService.getMaintenances(pageRequest).subscribe({
      next: (response) => {
        this.maintenances = response.content;
        this.filteredMaintenances = response.content;
        this.totalRecords = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load maintenances'
        });
        this.loading = false;
      }
    });
  }

  getEmptyMaintenance(): Maintenance {
    return {
      id: 0,
      serviceId: 0,
      serviceName: '',
      assignedToUserId: 1,
      assignedToUserName: 'Jean Dupont',
      date: new Date(),
      carRegistrationNumber: '',
      clientName: '',
      equipmentUsed: [],
      totalPrice: 0,
      discount: 0,
      finalPrice: 0,
      description: ''
    };
  }

  showDialog() {
    this.newMaintenance = this.getEmptyMaintenance();
    this.selectedEquipment = [];
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
  }

  onServiceChange(event: any) {
    const selectedService = this.services.find(s => s.id === event.value);
    if (selectedService) {
      this.newMaintenance.serviceName = selectedService.serviceName;
      this.calculateTotal();
    }
  }

  calculateTotal() {
    const selectedService = this.services.find(s => s.id === this.newMaintenance.serviceId);
    const servicePrice = selectedService ? selectedService.price : 0;
    
    const equipmentTotal = this.selectedEquipment.reduce(
      (total, item) => total + item.realPrice,
      0
    );
    
    this.newMaintenance.equipmentUsed = [...this.selectedEquipment];
    this.newMaintenance.totalPrice = servicePrice + equipmentTotal;
    
    if (this.newMaintenance.discount > this.newMaintenance.totalPrice) {
      this.newMaintenance.discount = this.newMaintenance.totalPrice;
    }
    
    this.newMaintenance.finalPrice = this.newMaintenance.totalPrice - this.newMaintenance.discount;
  }

  isValidMaintenance(): boolean {
    return !!(
      this.newMaintenance.clientName &&
      this.newMaintenance.carRegistrationNumber &&
      this.newMaintenance.serviceId &&
      this.newMaintenance.totalPrice > 0
    );
  }

  saveMaintenance() {
    if (this.isValidMaintenance()) {
      this.maintenanceService.addMaintenance(this.newMaintenance).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Maintenance added successfully'
          });
          this.loadMaintenances({ first: 0, rows: 10 });
          this.hideDialog();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add maintenance'
          });
        }
      });
    }
  }

  onSearch(term: string) {
    if (!term) {
      this.filteredMaintenances = this.maintenances;
    } else {
      const searchTerm = term.toLowerCase();
      this.filteredMaintenances = this.maintenances.filter(maintenance =>
        maintenance.clientName.toLowerCase().includes(searchTerm) ||
        maintenance.carRegistrationNumber.toLowerCase().includes(searchTerm) ||
        maintenance.id.toString().includes(searchTerm)
      );
    }
  }

  onGeneratePdf(maintenance: Maintenance) {
    this.pdfService.generateMaintenancePdf(maintenance);
  }
}