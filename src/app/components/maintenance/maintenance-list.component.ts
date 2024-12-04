import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Maintenance } from '../../models/maintenance.model';
import { FR } from '../../i18n/fr';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TooltipModule],
  template: `
    <p-table 
      [value]="maintenances" 
      [tableStyle]="{ 'min-width': '60rem' }"
      [paginator]="true" 
      [rows]="5" 
      [showCurrentPageReport]="true"
      styleClass="p-datatable-gridlines">
      <ng-template pTemplate="header">
        <tr>
          <th>{{i18n.common.id}}</th>
          <th>{{i18n.maintenance.client}}</th>
          <th>{{i18n.maintenance.carRegistration}}</th>
          <th>{{i18n.maintenance.service}}</th>
          <th>{{i18n.common.date}}</th>
          <th>{{i18n.maintenance.subtotal}}</th>
          <th>{{i18n.maintenance.discount}}</th>
          <th>{{i18n.maintenance.finalPrice}}</th>
          <th>{{i18n.common.actions}}</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-maintenance>
        <tr>
          <td>{{maintenance.id}}</td>
          <td>{{maintenance.clientName}}</td>
          <td>{{maintenance.carRegistrationNumber}}</td>
          <td>{{maintenance.serviceName}}</td>
          <td>{{maintenance.date | date:'dd/MM/yyyy'}}</td>
          <td>{{maintenance.totalPrice | currency:'TND'}}</td>
          <td>{{maintenance.discount | currency:'TND'}}</td>
          <td>{{maintenance.finalPrice | currency:'TND'}}</td>
          <td>
            <button 
              pButton 
              icon="pi pi-file-pdf" 
              class="p-button-rounded p-button-success p-button-text"
              (click)="generatePdf.emit(maintenance)"
              [pTooltip]="i18n.maintenance.generatePdf">
            </button>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="9" class="text-center p-4">{{i18n.maintenance.noRecords}}</td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class MaintenanceListComponent {
  @Input() maintenances: Maintenance[] = [];
  @Output() generatePdf = new EventEmitter<Maintenance>();
  
  i18n = FR;
}