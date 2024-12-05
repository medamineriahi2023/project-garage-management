import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageRequest, PageResponse } from '../../models/pagination.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  protected buildBaseParams(pageRequest: PageRequest): HttpParams {
    let params = new HttpParams()
      .set('page', pageRequest.page.toString())
      .set('size', pageRequest.size.toString());

    if (pageRequest.sort) {
      pageRequest.sort.forEach(sortItem => {
        params = params.append('sort', sortItem);
      });
    }

    return params;
  }

  protected getWithPagination<T>(endpoint: string, pageRequest: PageRequest): Observable<PageResponse<T>> {
    const params = this.buildBaseParams(pageRequest);
    return this.http.get<PageResponse<T>>(`${this.baseUrl}${endpoint}`, { params });
  }

  protected post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  protected put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data);
  }

  protected delete(endpoint: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${endpoint}`);
  }
}