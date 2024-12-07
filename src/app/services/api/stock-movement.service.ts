import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { StockMovement } from '../../models/stock-movement.model';
import { PageRequest, PageResponse } from '../../models/pagination.model';
import { StockMovementFilters } from '../../models/stock-filters.model';

@Injectable({
  providedIn: 'root'
})
export class StockMovementService extends BaseApiService {
  private endpoint = '/stock-movements';

  getStockMovements(pageRequest: PageRequest & StockMovementFilters): Observable<PageResponse<StockMovement>> {
    let params = this.buildBaseParams(pageRequest);
    
    if (pageRequest.startDate) {
      params = params.set('startDate', pageRequest.startDate.toISOString());
    }
    if (pageRequest.endDate) {
      params = params.set('endDate', pageRequest.endDate.toISOString());
    }
    if (pageRequest.type) {
      params = params.set('type', pageRequest.type);
    }
    if (pageRequest.source) {
      params = params.set('source', pageRequest.source);
    }

    return this.http.get<PageResponse<StockMovement>>(`${this.baseUrl}${this.endpoint}`, 
      { params, headers: this.headers }
    );
  }

  addStockMovement(movement: StockMovement): Observable<StockMovement> {
    return this.post<StockMovement>(this.endpoint, movement);
  }
}