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
import { MaintenanceFiltersComponent } from './maintenance-filters.component';
import { MaintenanceListComponent } from './maintenance-list.component';
import { Service } from '../../models/service.model';
import { StockItem } from '../../models/stock-item.model';
import { Maintenance } from '../../models/maintenance.model';
import { MovementType, MovementSource } from '../../models/stock-movement.model';
import { MockDataService } from '../../services/mock-data.service';
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
    MaintenanceFiltersComponent,
    MaintenanceListComponent
  ],
  template: `
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
                          currency="EUR"
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
  
  newMaintenance: Maintenance = this.getEmptyMaintenance();
  i18n = FR;

  constructor(
    private mockDataService: MockDataService,
    private pdfService: PdfService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.mockDataService.getServices().subscribe(services => {
      this.services = services;
    });

    this.mockDataService.getStockItems().subscribe(items => {
      this.stockItems = items;
    });

    this.mockDataService.getMaintenances().subscribe(maintenances => {
      this.maintenances = maintenances;
      this.filteredMaintenances = maintenances;
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

  createStockMovements() {
    // Create stock movements for each equipment used
    this.selectedEquipment.forEach(equipment => {
      const movement = {
        id: 0,
        stockItemId: equipment.id,
        stockItemName: equipment.name,
        quantity: 1, // Assuming 1 unit per equipment
        type: MovementType.OUT,
        source: MovementSource.MAINTENANCE,
        reference: `MAINT-${this.newMaintenance.id}`,
        date: new Date(),
        unitPrice: equipment.realPrice,
        totalPrice: equipment.realPrice,
        notes: `Utilisé pour la maintenance ${this.newMaintenance.id} - Client: ${this.newMaintenance.clientName}`
      };

      this.mockDataService.addStockMovement(movement).subscribe();
    });
  }

  saveMaintenance() {
    if (this.isValidMaintenance()) {
      this.mockDataService.addMaintenance(this.newMaintenance).subscribe(maintenance => {
        this.createStockMovements();
        this.loadData();
        this.hideDialog();
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