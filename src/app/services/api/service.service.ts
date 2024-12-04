import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Service } from '../../models/service.model';
import { PageRequest, PageResponse } from '../../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceApiService extends BaseApiService {
  private endpoint = '/services';

  getServices(pageRequest: PageRequest): Observable<PageResponse<Service>> {
    return this.getWithPagination<Service>(this.endpoint, pageRequest);
  }

  addService(service: Service): Observable<Service> {
    return this.post<Service>(this.endpoint, service);
  }

  updateService(id: number, service: Service): Observable<Service> {
    return this.put<Service>(`${this.endpoint}/${id}`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.delete(`${this.endpoint}/${id}`);
  }
}