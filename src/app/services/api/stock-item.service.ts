import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { StockItem } from '../../models/stock-item.model';
import { PageRequest, PageResponse } from '../../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class StockItemService extends BaseApiService {
  private endpoint = '/stock-items';

  getStockItems(pageRequest: PageRequest): Observable<PageResponse<StockItem>> {
    return this.getWithPagination<StockItem>(this.endpoint, pageRequest);
  }

  getStockItem(id: number): Observable<StockItem> {
    return this.http.get<StockItem>(`${this.baseUrl}${this.endpoint}/${id}`, { headers: this.headers });
  }

  addStockItem(item: StockItem): Observable<StockItem> {
    return this.post<StockItem>(this.endpoint, item);
  }

  updateStockItem(id: number, item: StockItem): Observable<StockItem> {
    return this.put<StockItem>(`${this.endpoint}/${id}`, item);
  }

  deleteStockItem(id: number): Observable<void> {
    return this.delete(`${this.endpoint}/${id}`);
  }

  getEquipment(pageRequest: PageRequest & { search?: string }): Observable<PageResponse<StockItem>> {
    let params = this.buildBaseParams(pageRequest);
    if (pageRequest.search) {
      params = params.set('search', pageRequest.search);
    }
    return this.http.get<PageResponse<StockItem>>(`${this.baseUrl}${this.endpoint}`, 
      { params, headers: this.headers }
    );
  }
}