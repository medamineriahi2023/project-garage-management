import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Maintenance } from '../../models/maintenance.model';
import { PageRequest, PageResponse } from '../../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService extends BaseApiService {
  private endpoint = '/maintenances';

  getMaintenances(pageRequest: PageRequest): Observable<PageResponse<Maintenance>> {
    return this.getWithPagination<Maintenance>(this.endpoint, pageRequest);
  }

  addMaintenance(maintenance: Maintenance): Observable<Maintenance> {
    return this.post<Maintenance>(this.endpoint, maintenance);
  }

  updateMaintenance(id: number, maintenance: Maintenance): Observable<Maintenance> {
    return this.put<Maintenance>(`${this.endpoint}/${id}`, maintenance);
  }

  deleteMaintenance(id: number): Observable<void> {
    return this.delete(`${this.endpoint}/${id}`);
  }
}