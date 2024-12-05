import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { Service } from '../../models/service.model';
import { ServiceApiService } from '../../services/api/service.service';
import { FR } from '../../i18n/fr';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-services',
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
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="card">
      <div class="flex justify-content-between align-items-center mb-4">
        <h2 class="text-2xl font-semibold text-primary m-0">
          <i class="pi pi-cog mr-2"></i>{{i18n.services.title}}
        </h2>
        <button pButton [label]="i18n.services.addService" 
                icon="pi pi-plus" 
                (click)="showDialog()"></button>
      </div>

      <p-table [value]="services" 
               [lazy]="true"
               (onLazyLoad)="loadServices($event)"
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
            <th>{{i18n.common.id}}</th>
            <th>{{i18n.services.serviceName}}</th>
            <th>{{i18n.services.servicePrice}}</th>
            <th>{{i18n.common.actions}}</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-service>
          <tr>
            <td>{{service.id}}</td>
            <td>{{service.serviceName}}</td>
            <td>{{service.price | currency:'TND'}}</td>
            <td>
              <button pButton icon="pi pi-trash" 
                      class="p-button-rounded p-button-danger p-button-text"
                      [pTooltip]="i18n.common.delete"
                      (click)="deleteService(service.id)"></button>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="4" class="text-center p-4">{{i18n.maintenance.noRecords}}</td>
          </tr>
        </ng-template>
      </p-table>

      <p-dialog [header]="i18n.services.addService" 
                [(visible)]="displayDialog"
                [style]="{width: '450px'}" 
                [modal]="true"
                styleClass="p-fluid">
        <div class="flex flex-column gap-3 pt-3">
          <div class="field">
            <label for="serviceName" class="font-medium">{{i18n.services.serviceName}}</label>
            <input pInputText id="serviceName" 
                   [(ngModel)]="newService.serviceName"
                   [placeholder]="i18n.services.serviceName"
                   class="w-full" />
          </div>
          <div class="field">
            <label for="price" class="font-medium">{{i18n.services.servicePrice}}</label>
            <p-inputNumber id="price" 
                          [(ngModel)]="newService.price"
                          mode="currency" 
                          currency="TND"
                          [min]="0"
                          [placeholder]="i18n.services.servicePrice"
                          class="w-full"></p-inputNumber>
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton [label]="i18n.common.cancel" 
                  (click)="hideDialog()" 
                  class="p-button-text"></button>
          <button pButton [label]="i18n.common.save" 
                  (click)="saveService()"
                  [disabled]="!isValidService()"></button>
        </ng-template>
      </p-dialog>
    </div>
  `
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  displayDialog = false;
  loading = false;
  totalRecords = 0;
  
  newService: Service = {
    id: 0,
    serviceName: '',
    price: 0
  };

  i18n = FR;

  constructor(
    private serviceApi: ServiceApiService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadServices({ first: 0, rows: 5 });
  }

  loadServices(event: any) {
    this.loading = true;
    const pageRequest = {
      page: Math.floor(event.first / event.rows),
      size: event.rows,
      sort: event.sortField ? [`${event.sortField},${event.sortOrder === 1 ? 'asc' : 'desc'}`] : undefined
    };

    this.serviceApi.getServices(pageRequest).subscribe({
      next: (response) => {
        this.services = response.content;
        this.totalRecords = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load services'
        });
        this.loading = false;
      }
    });
  }

  showDialog() {
    this.newService = {
      id: 0,
      serviceName: '',
      price: 0
    };
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
  }

  isValidService(): boolean {
    return !!(this.newService.serviceName && this.newService.price > 0);
  }

  saveService() {
    if (this.isValidService()) {
      this.serviceApi.addService(this.newService).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Service added successfully'
          });
          this.loadServices({ first: 0, rows: 5 });
          this.hideDialog();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add service'
          });
        }
      });
    }
  }

  deleteService(id: number) {
    this.serviceApi.deleteService(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Service deleted successfully'
        });
        this.loadServices({ first: 0, rows: 5 });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete service'
        });
      }
    });
  }
}
