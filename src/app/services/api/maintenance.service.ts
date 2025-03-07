import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Maintenance } from '../../models/maintenance.model';
import { PageRequest, PageResponse } from '../../models/pagination.model';

export interface MaintenanceSearchCriteria extends PageRequest {
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService extends BaseApiService {
  private endpoint = '/maintenances';
  private searchTerms = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http);
  }

  search(term: string) {
    this.searchTerms.next(term);
  }

  getSearchResults(): Observable<PageResponse<Maintenance>> {
    return this.searchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => this.getMaintenances({
          page: 0,
          size: 5,
          search: term
        }))
    );
  }

  getMaintenances(criteria: MaintenanceSearchCriteria): Observable<PageResponse<Maintenance>> {
    let params = this.buildBaseParams(criteria);

    if (criteria.search) {
      params = params.set('search', criteria.search);
    }

    return this.http.get<PageResponse<Maintenance>>(`${this.baseUrl}${this.endpoint}`, {
      params,
      headers: this.headers // Add headers to the request
    });
  }

  addMaintenance(maintenance: Maintenance): Observable<Maintenance> {
    return this.post<Maintenance>(this.endpoint, maintenance); // Headers are already included in the parent `post` method
  }

  updateMaintenance(id: number, maintenance: Maintenance): Observable<Maintenance> {
    return this.put<Maintenance>(`${this.endpoint}/${id}`, maintenance); // Headers are already included in the parent `put` method
  }

  deleteMaintenance(id: number): Observable<void> {
    return this.delete(`${this.endpoint}/${id}`); // Headers are already included in the parent `delete` method
  }
}
