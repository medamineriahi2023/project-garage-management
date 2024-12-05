import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageRequest, PageResponse } from '../../models/pagination.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected baseUrl = environment.apiUrl;

  // Define the headers to be used
  public headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });

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
    return this.http.get<PageResponse<T>>(`${this.baseUrl}${endpoint}`, { params, headers: this.headers });
  }

  protected post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, { headers: this.headers });
  }

  protected put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, { headers: this.headers });
  }

  protected delete(endpoint: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${endpoint}`, { headers: this.headers });
  }
}
