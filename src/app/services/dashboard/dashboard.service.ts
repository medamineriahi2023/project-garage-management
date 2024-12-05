import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardApiService } from './dashboard-api.service';
import { DashboardData } from './dashboard-data.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private dashboardApi: DashboardApiService) {}

  getDashboardData(period: string): Observable<DashboardData> {
    return this.dashboardApi.getDashboardData(period);
  }
}