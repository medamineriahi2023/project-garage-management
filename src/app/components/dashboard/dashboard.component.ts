import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { FR } from '../../i18n/fr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    CardModule,
    ChartModule,
    FormsModule
  ],
  template: `
    <div class="card">
      <div class="flex justify-content-between align-items-center mb-4">
        <h2 class="text-2xl font-semibold text-primary m-0">
          <i class="pi pi-chart-line mr-2"></i>{{i18n.dashboard.title}}
        </h2>
        <p-dropdown [options]="periodOptions" 
                   [(ngModel)]="selectedPeriod" 
                   (onChange)="onPeriodChange()"
                   optionLabel="label"
                   optionValue="value">
        </p-dropdown>
      </div>

      <div class="grid">
        <!-- Summary Cards -->
        <div class="col-12 md:col-6 lg:col-3">
          <p-card styleClass="h-full">
            <div class="flex flex-column align-items-center">
              <span class="text-lg font-medium mb-2">{{i18n.dashboard.revenue}}</span>
              <span class="text-2xl font-bold text-primary">{{summary.revenue | currency:'TND'}}</span>
              <span [class]="getPercentageClass(summary.revenueChange)">
                {{summary.revenueChange}}%
              </span>
            </div>
          </p-card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <p-card styleClass="h-full">
            <div class="flex flex-column align-items-center">
              <span class="text-lg font-medium mb-2">{{i18n.dashboard.expenses}}</span>
              <span class="text-2xl font-bold text-pink-500">{{summary.expenses | currency:'TND'}}</span>
              <span [class]="getPercentageClass(-summary.expensesChange)">
                {{summary.expensesChange}}%
              </span>
            </div>
          </p-card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <p-card styleClass="h-full">
            <div class="flex flex-column align-items-center">
              <span class="text-lg font-medium mb-2">{{i18n.dashboard.profit}}</span>
              <span class="text-2xl font-bold text-green-500">{{summary.profit | currency:'TND'}}</span>
              <span [class]="getPercentageClass(summary.profitChange)">
                {{summary.profitChange}}%
              </span>
            </div>
          </p-card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <p-card styleClass="h-full">
            <div class="flex flex-column align-items-center">
              <span class="text-lg font-medium mb-2">{{i18n.dashboard.maintenances}}</span>
              <span class="text-2xl font-bold text-blue-500">{{summary.maintenanceCount}}</span>
              <span [class]="getPercentageClass(summary.maintenanceCountChange)">
                {{summary.maintenanceCountChange}}%
              </span>
            </div>
          </p-card>
        </div>

        <!-- Charts -->
        <div class="col-12 lg:col-6">
          <p-card [header]="i18n.dashboard.revenueExpenses">
            <p-chart type="line" [data]="revenueExpensesData" [options]="chartOptions"></p-chart>
          </p-card>
        </div>

        <div class="col-12 lg:col-6">
          <p-card [header]="i18n.dashboard.profitTrend">
            <p-chart type="bar" [data]="profitData" [options]="chartOptions"></p-chart>
          </p-card>
        </div>

        <div class="col-12 lg:col-6">
          <p-card [header]="i18n.dashboard.topServices">
            <p-chart type="doughnut" [data]="servicesData" [options]="pieOptions"></p-chart>
          </p-card>
        </div>

        <div class="col-12 lg:col-6">
          <p-card [header]="i18n.dashboard.stockValue">
            <p-chart type="pie" [data]="stockData" [options]="pieOptions"></p-chart>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-card {
      height: 100%;
    }
    
    .percentage-up {
      color: var(--green-500);
    }
    
    .percentage-down {
      color: var(--red-500);
    }
    
    .percentage-neutral {
      color: var(--text-color-secondary);
    }
  `]
})
export class DashboardComponent implements OnInit {
  i18n = FR;
  selectedPeriod = 'month';
  periodOptions = [
    { label: 'Jour', value: 'day' },
    { label: 'Semaine', value: 'week' },
    { label: 'Mois', value: 'month' },
    { label: 'Année', value: 'year' }
  ];

  summary = {
    revenue: 0,
    revenueChange: 0,
    expenses: 0,
    expensesChange: 0,
    profit: 0,
    profitChange: 0,
    maintenanceCount: 0,
    maintenanceCountChange: 0
  };

  revenueExpensesData: any;
  profitData: any;
  servicesData: any;
  stockData: any;

  chartOptions = {
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  pieOptions = {
    plugins: {
      legend: {
        position: 'right'
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  onPeriodChange() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.dashboardService.getDashboardData(this.selectedPeriod).subscribe(data => {
      this.summary = data.summary;
      this.revenueExpensesData = data.revenueExpensesChart;
      this.profitData = data.profitChart;
      this.servicesData = data.servicesChart;
      this.stockData = data.stockChart;
    });
  }

  getPercentageClass(value: number): string {
    if (value > 0) return 'percentage-up';
    if (value < 0) return 'percentage-down';
    return 'percentage-neutral';
  }
}