import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { StockMovement } from '../../models/stock-movement.model';
import { PageRequest, PageResponse } from '../../models/pagination.model';
import { NotificationService } from '../notification.service';
import { StockItemService } from './stock-item.service';
import { StockItem } from '../../models/stock-item.model';

@Injectable({
  providedIn: 'root'
})
export class StockMovementService extends BaseApiService {
  private endpoint = '/stock-movements';

  constructor(
    protected override http: HttpClient,
    private notificationService: NotificationService,
    private stockItemService: StockItemService
  ) {
    super(http);
  }

  getStockMovements(pageRequest: PageRequest): Observable<PageResponse<StockMovement>> {
    return this.getWithPagination<StockMovement>(this.endpoint, pageRequest);
  }

  addStockMovement(movement: StockMovement): Observable<StockMovement> {
    const formattedMovement = {
      ...movement,
      date: new Date(movement.date).toISOString()
    };

    return this.post<StockMovement>(this.endpoint, formattedMovement).pipe(
      tap(() => {
        // After movement is added, check the updated stock level
        this.stockItemService.getStockItem(movement.stockItemId).subscribe(
          (stockItem: StockItem) => {
            this.notificationService.checkStockLevel(stockItem);
          }
        );
      })
    );
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