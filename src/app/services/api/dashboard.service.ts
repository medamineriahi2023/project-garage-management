import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface DashboardData {
  summary: {
    revenue: number;
    revenueChange: number;
    expenses: number;
    expensesChange: number;
    profit: number;
    profitChange: number;
    maintenanceCount: number;
    maintenanceCountChange: number;
  };
  revenueExpensesChart: any;
  profitChart: any;
  servicesChart: any;
  stockChart: any;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardApiService extends BaseApiService {
  private endpoint = '/dashboard';

  getDashboardData(period: string): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}${this.endpoint}?period=${period}`);
  }
}