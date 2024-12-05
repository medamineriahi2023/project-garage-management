import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { StockMovement } from '../../models/stock-movement.model';
import { PageRequest, PageResponse } from '../../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class StockMovementService extends BaseApiService {
  private endpoint = '/stock-movements';

  getStockMovements(pageRequest: PageRequest): Observable<PageResponse<StockMovement>> {
    return this.getWithPagination<StockMovement>(this.endpoint, pageRequest);
  }

  addStockMovement(movement: StockMovement): Observable<StockMovement> {
    // Ensure date is properly formatted
    const formattedMovement = {
      ...movement,
      date: new Date(movement.date).toISOString()
    };
    return this.post<StockMovement>(this.endpoint, formattedMovement);
  }

  updateStockMovement(id: number, movement: StockMovement): Observable<StockMovement> {
    const formattedMovement = {
      ...movement,
      date: new Date(movement.date).toISOString()
    };
    return this.put<StockMovement>(`${this.endpoint}/${id}`, formattedMovement);
  }

  deleteStockMovement(id: number): Observable<void> {
    return this.delete(`${this.endpoint}/${id}`);
  }
}
