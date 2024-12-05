import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../api/base-api.service';
import { DashboardData } from './dashboard-data.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardApiService extends BaseApiService {
  private endpoint = '/dashboard';

  getDashboardData(period: string): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}${this.endpoint}`, {
      params: { period }, headers: this.headers
    });
  }
}
