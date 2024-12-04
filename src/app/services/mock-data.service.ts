import { Injectable } from '@angular/core';
import { Service } from '../models/service.model';
import { StockItem } from '../models/stock-item.model';
import { Maintenance } from '../models/maintenance.model';
import { StockMovement, MovementType, MovementSource } from '../models/stock-movement.model';
import { NotificationService } from './notification.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private services: Service[] = [
    { id: 1, serviceName: 'Vidange', price: 30 },
    { id: 2, serviceName: 'Entretien des freins', price: 80 },
    { id: 3, serviceName: 'Rotation des pneus', price: 40 }
  ];

  private stockItems: StockItem[] = [
    { id: 1, name: 'Huile moteur', minQuantity: 10, unitPrice: 25, realPrice: 35, currentQuantity: 20 },
    { id: 2, name: 'Filtre à huile', minQuantity: 5, unitPrice: 10, realPrice: 15, currentQuantity: 15 },
    { id: 3, name: 'Plaquettes de frein', minQuantity: 4, unitPrice: 40, realPrice: 60, currentQuantity: 8 }
  ];

  private stockMovements: StockMovement[] = [
    {
      id: 1,
      stockItemId: 1,
      stockItemName: 'Huile moteur',
      quantity: 5,
      type: MovementType.IN,
      source: MovementSource.PURCHASE,
      reference: 'PO-001',
      date: new Date(),
      unitPrice: 25,
      totalPrice: 125,
      notes: 'Réapprovisionnement régulier'
    }
  ];

  private maintenances: Maintenance[] = [];

  constructor(private notificationService: NotificationService) {
    this.checkStockLevels();
  }

  private checkStockLevels(): void {
    this.stockItems.forEach(item => {
      if (item.currentQuantity <= item.minQuantity) {
        this.notificationService.addNotification(item);
      }
    });
  }

  getServices(): Observable<Service[]> {
    return of(this.services);
  }

  addService(service: Service): Observable<Service> {
    service.id = this.services.length + 1;
    this.services.push(service);
    return of(service);
  }

  deleteService(id: number): Observable<void> {
    this.services = this.services.filter(s => s.id !== id);
    return of(void 0);
  }

  getStockItems(): Observable<StockItem[]> {
    return of(this.stockItems);
  }

  addStockItem(item: StockItem): Observable<StockItem> {
    item.id = this.stockItems.length + 1;
    this.stockItems.push(item);
    if (item.currentQuantity <= item.minQuantity) {
      this.notificationService.addNotification(item);
    }
    return of(item);
  }

  getMaintenances(): Observable<Maintenance[]> {
    return of(this.maintenances);
  }

  addMaintenance(maintenance: Maintenance): Observable<Maintenance> {
    maintenance.id = this.maintenances.length + 1;
    this.maintenances.push(maintenance);
    return of(maintenance);
  }

  getStockMovements(): Observable<StockMovement[]> {
    return of(this.stockMovements);
  }

  addStockMovement(movement: StockMovement): Observable<StockMovement> {
    movement.id = this.stockMovements.length + 1;
    movement.date = new Date();
    this.stockMovements.push(movement);

    const stockItem = this.stockItems.find(item => item.id === movement.stockItemId);
    if (stockItem) {
      if (movement.type === MovementType.IN) {
        stockItem.currentQuantity += movement.quantity;
      } else {
        stockItem.currentQuantity -= movement.quantity;
      }
      
      if (stockItem.currentQuantity <= stockItem.minQuantity) {
        this.notificationService.addNotification(stockItem);
      }
    }

    return of(movement);
  }
}