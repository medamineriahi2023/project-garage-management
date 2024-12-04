import { Injectable } from '@angular/core';
import { Service } from '../models/service.model';
import { StockItem } from '../models/stock-item.model';
import { Maintenance } from '../models/maintenance.model';
import { StockMovement, MovementType, MovementSource } from '../models/stock-movement.model';
import { NotificationService } from './notification.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private services: Service[] = [
    { id: 1, serviceName: 'Vidange', price: 30 },
    { id: 2, serviceName: 'Entretien des freins', price: 80 },
    { id: 3, serviceName: 'Rotation des pneus', price: 40 }
  ];

  // Start with empty stock
  private stockItems: StockItem[] = [];
  private stockMovements: StockMovement[] = [];
  private maintenances: Maintenance[] = [];
  private lastStockItemId = 0;
  private lastMovementId = 0;

  constructor(private notificationService: NotificationService) {
    // Initialize with some stock items
    this.initializeStock();
  }

  private initializeStock(): void {
    const initialItems = [
      { name: 'Huile moteur', minQuantity: 10, unitPrice: 25, realPrice: 35, currentQuantity: 20 },
      { name: 'Filtre à huile', minQuantity: 5, unitPrice: 10, realPrice: 15, currentQuantity: 15 },
      { name: 'Plaquettes de frein', minQuantity: 4, unitPrice: 40, realPrice: 60, currentQuantity: 8 }
    ];

    initialItems.forEach(item => {
      this.addStockItem({
        id: 0,
        ...item
      }).subscribe();
    });
  }

  private checkStockLevels(): void {
    this.stockItems.forEach(item => {
      if (item.currentQuantity <= item.minQuantity) {
        this.notificationService.addNotification(item);
      }
    });
  }

  private updateStockQuantity(stockItemId: number, quantity: number, type: MovementType): void {
    const stockItem = this.stockItems.find(item => item.id === stockItemId);
    if (stockItem) {
      if (type === MovementType.IN) {
        stockItem.currentQuantity += quantity;
      } else {
        stockItem.currentQuantity = Math.max(0, stockItem.currentQuantity - quantity);
      }
      
      if (stockItem.currentQuantity <= stockItem.minQuantity) {
        this.notificationService.addNotification(stockItem);
      }
    }
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
    // Generate new ID
    this.lastStockItemId++;
    item.id = this.lastStockItemId;
    
    // Add item to stock
    this.stockItems.push(item);
    
    // Create initial stock movement
    const movement: StockMovement = {
      id: ++this.lastMovementId,
      stockItemId: item.id,
      stockItemName: item.name,
      quantity: item.currentQuantity,
      type: MovementType.IN,
      source: MovementSource.ADJUSTMENT,
      reference: `INIT-${item.id}`,
      date: new Date(),
      unitPrice: item.unitPrice,
      totalPrice: item.unitPrice * item.currentQuantity,
      notes: `Initial stock for ${item.name}`
    };
    
    this.stockMovements.push(movement);

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

    // Create stock movements for equipment used
    maintenance.equipmentUsed.forEach(equipment => {
      this.addStockMovement({
        id: 0,
        stockItemId: equipment.id,
        stockItemName: equipment.name,
        quantity: 1,
        type: MovementType.OUT,
        source: MovementSource.MAINTENANCE,
        reference: `MAINT-${maintenance.id}`,
        date: new Date(),
        unitPrice: equipment.unitPrice,
        totalPrice: equipment.unitPrice,
        notes: `Used in maintenance ${maintenance.id} for ${maintenance.clientName}`
      }).subscribe();
    });

    return of(maintenance);
  }

  getStockMovements(): Observable<StockMovement[]> {
    return of(this.stockMovements);
  }

  addStockMovement(movement: StockMovement): Observable<StockMovement> {
    // Get the related stock item
    const stockItem = this.stockItems.find(item => item.id === movement.stockItemId);
    if (!stockItem) {
      throw new Error('Stock item not found');
    }

    // Validate stock levels for OUT movements
    if (movement.type === MovementType.OUT && 
        stockItem.currentQuantity < movement.quantity) {
      throw new Error('Insufficient stock quantity');
    }

    // Update movement with current stock item prices
    movement.unitPrice = stockItem.unitPrice;
    movement.totalPrice = movement.quantity * movement.unitPrice;
    movement.stockItemName = stockItem.name;

    // Generate new ID and set date
    movement.id = ++this.lastMovementId;
    movement.date = new Date();
    
    // Add movement to history
    this.stockMovements.push(movement);

    // Update stock quantity
    this.updateStockQuantity(movement.stockItemId, movement.quantity, movement.type);

    return of(movement);
  }
}