import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { StockItem } from '../../models/stock-item.model';
import { PageRequest, PageResponse } from '../../models/pagination.model';
import { StockFilters } from '../../models/stock-filters.model';

@Injectable({
  providedIn: 'root'
})
export class StockItemService extends BaseApiService {
  private endpoint = '/stock-items';

  getStockItems(pageRequest: PageRequest & StockFilters): Observable<PageResponse<StockItem>> {
    let params = this.buildBaseParams(pageRequest);
    
    if (pageRequest.status && pageRequest.status !== 'ALL') {
      params = params.set('status', pageRequest.status);
    }
    if (pageRequest.search) {
      params = params.set('search', pageRequest.search);
    }

    return this.http.get<PageResponse<StockItem>>(`${this.baseUrl}${this.endpoint}`, 
      { params, headers: this.headers }
    );
  }

  getStockItem(id: number): Observable<StockItem> {
    return this.http.get<StockItem>(`${this.baseUrl}${this.endpoint}/${id}`, 
      { headers: this.headers }
    );
  }

  addStockItem(item: StockItem): Observable<StockItem> {
    return this.post<StockItem>(this.endpoint, item);
  }

  getEquipment(pageRequest: PageRequest & { search?: string }): Observable<PageResponse<StockItem>> {
    let params = this.buildBaseParams(pageRequest);
    if (pageRequest.search) {
      params = params.set('search', pageRequest.search);
    }
    return this.http.get<PageResponse<StockItem>>(`${this.baseUrl}${this.endpoint}/equipment`, 
      { params, headers: this.headers }
    );
  }
}